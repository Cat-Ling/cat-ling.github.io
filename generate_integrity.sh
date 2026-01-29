#!/bin/bash

# Function to calculate SHA-384 hash
get_hash() {
    openssl dgst -sha384 -binary "$1" | openssl base64 -A
}

# Function to update HTML file
# Usage: update_html "html_file" "file_path_in_html" "hash" "type"
update_html() {
    local html=$1
    local path=$2
    local hash=$3
    local type=$4
    local integrity="sha384-$hash"

    if [ ! -f "$html" ]; then return; fi

    # Use a loop to handle each file type
    # We will use a temporary file strategy to ensure clean replacements
    
    if [ "$type" == "js" ]; then
        # Check if integrity exists for this file
        if grep -q "src=\"$path\"" "$html" && grep -q "src=\"$path\".*integrity=" "$html"; then
             # It exists on same line, replace it
             sed -i "s|src=\"$path\"[^>]*integrity=\"[^\"]*\"|src=\"$path\" integrity=\"$integrity\"|g" "$html"
        elif grep -q "src=\"$path\"" "$html"; then
             # It exists but maybe no integrity, or multi-line key?
             # Let's try a simpler approach: Replace exact integrity hash if strict match found 
             # OR if that fails, replace the src attribute to include integrity
             # Current issue: multi-line tags.
             # Solution: perl one-liner for multi-line replacement
             perl -i -0777 -pe "s|src=\"$path\"[^>]*integrity=\"sha384-[^\"]*\"|src=\"$path\" integrity=\"$integrity\"|gs" "$html"
             
             # If no integrity was there to begin with (e.g. first run), add it
             # This perl command checks if integrity is missing
             perl -i -0777 -pe "s|src=\"$path\"((?!integrity).)*?>|src=\"$path\" integrity=\"$integrity\" crossorigin=\"anonymous\" defer>|gs" "$html"
        fi
    elif [ "$type" == "css" ]; then
         perl -i -0777 -pe "s|href=\"$path\"[^>]*integrity=\"sha384-[^\"]*\"|href=\"$path\" integrity=\"$integrity\"|gs" "$html"
         perl -i -0777 -pe "s|href=\"$path\"((?!integrity).)*?>|href=\"$path\" integrity=\"$integrity\" crossorigin=\"anonymous\">|gs" "$html"
    fi
}

echo "Updating integrity hashes..."

# 1. Process Root Files
# Files located in the root directory
ROOT_FILES=("DuckDuckGo.js" "Bangs.js" "Submit.js" "Listener.js" "Search.js" "sloppy.css")

for file in "${ROOT_FILES[@]}"; do
    if [ -f "$file" ]; then
        hash=$(get_hash "$file")
        ext="${file##*.}"
        
        echo "  [ROOT] $file -> $hash"
        
        # Update index.html (uses ./File)
        update_html "index.html" "./$file" "$hash" "$ext"
        
        # Update search/index.html (uses ../File)
        # Note: root Search.js is NOT used in search/index.html
        if [ "$file" != "Search.js" ] && [ "$file" != "Listener.js" ]; then
            update_html "search/index.html" "../$file" "$hash" "$ext"
        fi
    fi
done

# 2. Process Search-Specific Files
# Files located in the search/ directory
if [ -f "search/Search.js" ]; then
    hash=$(get_hash "search/Search.js")
    echo "  [SEARCH] search/Search.js -> $hash"
    
    # Update search/index.html (uses ./Search.js)
    update_html "search/index.html" "./Search.js" "$hash" "js"
fi

echo "Integrity attributes updated."
