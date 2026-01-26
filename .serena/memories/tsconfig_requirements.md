# TypeScript Configuration Requirements

## Required Configuration
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Key Points
1. `DOM.Iterable` is required for `URLSearchParams.entries()` support
2. `moduleResolution: "bundler"` allows imports without file extensions
3. Keep `strict: true`
