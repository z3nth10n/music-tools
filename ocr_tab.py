import easyocr
import cv2
import numpy as np
import sys

def detect_lines(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=100, maxLineGap=10)
    
    horizontal_lines = []
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            if abs(y2 - y1) < 5:
                horizontal_lines.append(int((y1 + y2) / 2))
    
    horizontal_lines.sort()
    unique_lines = []
    if horizontal_lines:
        current_group = [horizontal_lines[0]]
        for y in horizontal_lines[1:]:
            if y - current_group[-1] < 10:
                current_group.append(y)
            else:
                unique_lines.append(int(sum(current_group) / len(current_group)))
                current_group = [y]
        unique_lines.append(int(sum(current_group) / len(current_group)))
    
    # Filter lines that are likely the 6 strings (look for 6 lines with similar spacing)
    if len(unique_lines) >= 6:
        return unique_lines[:6]
    return unique_lines

def process_tab_image(image_path):
    print(f"Processing {image_path}...")
    
    # 1. Detect Lines
    string_y_coords = detect_lines(image_path)
    print(f"Detected string lines at: {string_y_coords}")
    
    if len(string_y_coords) < 6:
        print("Error: Could not detect 6 guitar strings.")
        return

    # 2. Run OCR
    reader = easyocr.Reader(['en'], gpu=False) 
    result = reader.readtext(image_path)
    
    # 3. Group detections
    metadata = []
    pm_markers = []
    string_content = {i: [] for i in range(6)} # 0=e, 1=B, etc.
    
    top_string_y = string_y_coords[0]
    line_spacing = string_y_coords[1] - string_y_coords[0]
    
    for (bbox, text, prob) in result:
        y_center = (bbox[0][1] + bbox[2][1]) / 2
        x_start = bbox[0][0]
        
        # Check if it's metadata (well above first string)
        if y_center < top_string_y - line_spacing:
            if "P M" in text or "PM" in text:
                pm_markers.append({'x': x_start, 'text': text})
            elif "J=" in text or "BPM" in text:
                metadata.append(text)
            else:
                pass
        else:
            # Find closest string
            closest_idx = -1
            min_dist = float('inf')
            for i, string_y in enumerate(string_y_coords):
                dist = abs(y_center - string_y)
                if dist < min_dist:
                    min_dist = dist
                    closest_idx = i
            
            # If it's close enough to a string line (e.g. within half spacing)
            if min_dist < line_spacing * 0.8:
                string_content[closest_idx].append({'x': x_start, 'text': text})

    # 4. Construct Output
    output_lines = []
    
    # BPM
    bpm = "120" # Default
    for m in metadata:
        if "J=" in m:
            bpm = m.replace("J=", "").strip()
        if "BPM" in m:
            bpm = m.replace("BPM", "").replace(":", "").strip()
    output_lines.append(f"BPM: {bpm}")
    output_lines.append("Time: 4/4") 
    
    # Determine grid
    max_x = 0
    for s in string_content.values():
        for item in s:
            max_x = max(max_x, item['x'] + len(item['text'])*10) # Estimate end
    
    char_width = 12 # Approximate pixels per char
    line_length_chars = int(max_x / char_width) + 20
    
    # Initialize lines with dashes
    tab_lines = [['-' for _ in range(line_length_chars)] for _ in range(6)]
    pm_line = [' ' for _ in range(line_length_chars)]
    
    # Fill PM
    for item in pm_markers:
        pos = int(item['x'] / char_width)
        if pos < len(pm_line):
            pm_line[pos] = 'P'
            if pos+1 < len(pm_line): pm_line[pos+1] = 'M'
            # Extend dashes for PM if text has them?
            # OCR text might be "P M:-----"
            if "-----" in item['text']:
                dash_count = item['text'].count('-')
                for k in range(dash_count):
                    if pos + 2 + k < len(pm_line):
                        pm_line[pos + 2 + k] = '-'
    
    # Fill Strings
    for str_idx in range(6):
        for item in string_content[str_idx]:
            text = item['text']
            start_pos = int(item['x'] / char_width)
            
            # Handle "1012" case -> "10" and "12"
            # This is a hack, but if we see 4 digits, it's likely two 2-digit notes
            # unless it's fret 1012 (impossible).
            # But wait, "1012" could be 10, 1, 2? Or 1, 0, 1, 2?
            # Without more context it's hard.
            # Let's just write what OCR found for now.
            
            for i, char in enumerate(text):
                if start_pos + i < len(tab_lines[str_idx]):
                    tab_lines[str_idx][start_pos + i] = char

    # Add headers
    string_names = ['e', 'B', 'G', 'D', 'A', 'E']
    
    output_lines.append("PM|" + "".join(pm_line))
    
    for i in range(6):
        line_str = "".join(tab_lines[i])
        output_lines.append(f"{string_names[i]}|{line_str}")

    # Save to file
    with open('tabs/ocr_result.txt', 'w') as f:
        f.write("\n".join(output_lines))
    
    print("Conversion complete. Saved to tabs/ocr_result.txt")
    print("\n".join(output_lines))

if __name__ == "__main__":
    process_tab_image("tabs/tabs.png")
