# Notes

## What are that strange html attributes in the code ??
### attribute 'data-icon'
Used for injecting icon svg with js
Mutation Observer for reinjecting them in case a element is recreated
The script is src/js/module/Icons.js

### attribute 'data-shape-divider'
Used for injecting icon svg with js
Mutation Observer for reinjecting them in case a element is recreated
The script is src/js/module/ShapeDividers.js

### attribute 'data-js'
Used as selector for JS interaction operation
Used in multiple scripts, like :
- src/js/module/HomeGrid
- src/js/module/Works
- ...

### attribute 'data-gtm-xxxx'
Used as selector by Google Tag Manager for Analytics Purpose
data_gtm_el indicates which kind of element
data_gtm_el_key indicates which item in a list of elements of the same type