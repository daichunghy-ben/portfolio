import os, json, shutil

history_dir = os.path.expanduser("~/Library/Application Support/Antigravity/User/History")
dest_dir = "/Users/macos/Desktop/portfolio_hy_resources"

for folder in os.listdir(history_dir):
    folder_path = os.path.join(history_dir, folder)
    if not os.path.isdir(folder_path): continue
    
    entries_file = os.path.join(folder_path, "entries.json")
    if not os.path.exists(entries_file): continue
    
    try:
        data = json.load(open(entries_file))
        resource = data.get("resource", "")
        if "portfolio_hy_resources" in resource and resource.endswith(".html"):
            filename = os.path.basename(resource)
            
            # get the biggest file from history to avoid taking 0-byte
            biggest_size = 0
            best_entry_path = None
            for entry in data.get("entries", []):
                entry_path = os.path.join(folder_path, entry.get("id"))
                if os.path.exists(entry_path):
                    sz = os.path.getsize(entry_path)
                    if sz > biggest_size:
                        biggest_size = sz
                        best_entry_path = entry_path
            
            if best_entry_path and biggest_size > 500: # at least 500 bytes
                dest_path = os.path.join(dest_dir, filename)
                shutil.copy2(best_entry_path, dest_path)
                print(f"Restored {filename} from {best_entry_path} ({biggest_size} bytes)")
    except Exception as e:
        pass
