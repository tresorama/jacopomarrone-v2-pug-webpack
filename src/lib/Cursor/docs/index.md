```js
new Cursor({ delay: 35 });
```

```css
.cursor {
  /* Added by consumer */
  --aspect-ratio: 1;
  /* Cursor Exposed Variables */
  --bg-color: red;
  --width: 20vw;
  --height: calc(var(--width) * var(--aspect-ratio));
  --border-radius: 0;
  --text: none;
}
```
