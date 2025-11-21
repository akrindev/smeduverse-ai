# SMEduverse AI Widget - CDN Usage Guide

## 🚀 Quick Start

Add the SMEduverse AI Widget to any website with just two lines of code:

```html
<script src="https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js"></script>
<script>
  SmeduverseAI.init({
    apiEndpoint: 'https://your-domain.vercel.app/api/chat'
  });
</script>
```

## 📦 Installation Methods

### Method 1: Basic Integration (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your content here -->

    <!-- Add before closing </body> tag -->
    <script src="https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js"></script>
    <script>
      SmeduverseAI.init({
        apiEndpoint: 'https://your-domain.vercel.app/api/chat',
        position: 'bottom-right',
        primaryColor: '#3b82f6',
        title: 'Ask AI Teacher',
        darkMode: false
      });
    </script>
</body>
</html>
```

### Method 2: Auto-initialization with Data Attributes

```html
<script 
  src="https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js"
  data-smeduverse-ai="auto"
  data-api-endpoint="https://your-domain.vercel.app/api/chat"
  data-position="bottom-right"
  data-primary-color="#3b82f6"
  data-title="Ask AI Teacher"
  data-dark-mode="false"
></script>
```

### Method 3: Programmatic Control

```html
<script src="https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js"></script>
<script>
  // Initialize when button is clicked
  document.getElementById('show-widget').addEventListener('click', function() {
    const cleanup = SmeduverseAI.init({
      apiEndpoint: 'https://your-domain.vercel.app/api/chat'
    });

    // Later, destroy the widget
    // cleanup();
  });
</script>
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiEndpoint` | `string` | **Required** | Your API endpoint URL |
| `position` | `'bottom-right'` \| `'bottom-left'` \| `'bottom-center'` | `'bottom-right'` | Widget position on page |
| `primaryColor` | `string` | `undefined` | Primary color (hex, rgb, oklch) |
| `title` | `string` | `'Smeduverse AI'` | Widget header title |
| `darkMode` | `boolean` | `false` | Enable dark mode |
| `containerId` | `string` | `'smeduverse-ai-widget-container'` | Custom container ID |

## 🎨 Customization Examples

### Custom Colors

```javascript
SmeduverseAI.init({
  apiEndpoint: 'https://your-domain.vercel.app/api/chat',
  primaryColor: '#10b981', // Green theme
  darkMode: true
});
```

### Different Positions

```javascript
// Bottom left
SmeduverseAI.init({
  apiEndpoint: 'https://your-domain.vercel.app/api/chat',
  position: 'bottom-left'
});

// Bottom center
SmeduverseAI.init({
  apiEndpoint: 'https://your-domain.vercel.app/api/chat',
  position: 'bottom-center'
});
```

### Multiple Instances

```javascript
// Widget 1 - Support
SmeduverseAI.init({
  apiEndpoint: 'https://your-domain.vercel.app/api/chat',
  position: 'bottom-right',
  title: 'Support Chat',
  containerId: 'support-widget'
});

// Widget 2 - Sales
SmeduverseAI.init({
  apiEndpoint: 'https://your-domain.vercel.app/api/chat',
  position: 'bottom-left',
  title: 'Sales Chat',
  containerId: 'sales-widget'
});
```

## 🔧 API Reference

### `SmeduverseAI.init(config)`

Initialize a new widget instance.

**Parameters:**
- `config` (Object) - Configuration options

**Returns:**
- `Function` - Cleanup function to destroy the widget

**Example:**
```javascript
const cleanup = SmeduverseAI.init({
  apiEndpoint: 'https://your-domain.vercel.app/api/chat'
});

// Later...
cleanup(); // Removes the widget
```

### `SmeduverseAI.destroy(containerId?)`

Destroy a widget instance.

**Parameters:**
- `containerId` (string, optional) - ID of container to destroy. Defaults to `'smeduverse-ai-widget-container'`

**Example:**
```javascript
SmeduverseAI.destroy(); // Destroy default widget
SmeduverseAI.destroy('custom-widget-id'); // Destroy specific widget
```

### `SmeduverseAI.getVersion()`

Get the widget version.

**Returns:**
- `string` - Version number

**Example:**
```javascript
console.log(SmeduverseAI.getVersion()); // "1.0.0"
```

## 🌐 Framework Integration

### React

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load script
    const script = document.createElement('script');
    script.src = 'https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js';
    script.async = true;
    
    script.onload = () => {
      const cleanup = window.SmeduverseAI.init({
        apiEndpoint: 'https://your-domain.vercel.app/api/chat'
      });
      
      return cleanup;
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (window.SmeduverseAI) {
        window.SmeduverseAI.destroy();
      }
      document.body.removeChild(script);
    };
  }, []);

  return <div>Your App</div>;
}
```

### Vue.js

```vue
<template>
  <div id="app">
    <!-- Your content -->
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js';
    script.async = true;
    
    script.onload = () => {
      this.cleanup = window.SmeduverseAI.init({
        apiEndpoint: 'https://your-domain.vercel.app/api/chat'
      });
    };
    
    document.body.appendChild(script);
  },
  beforeDestroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}
</script>
```

### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>Your App</div>'
})
export class AppComponent implements OnInit, OnDestroy {
  private cleanup?: () => void;

  ngOnInit() {
    const script = document.createElement('script');
    script.src = 'https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js';
    script.async = true;
    
    script.onload = () => {
      this.cleanup = (window as any).SmeduverseAI.init({
        apiEndpoint: 'https://your-domain.vercel.app/api/chat'
      });
    };
    
    document.body.appendChild(script);
  }

  ngOnDestroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}
```

## 🔍 Troubleshooting

### Widget doesn't appear

1. Check console for errors
2. Verify script URL is correct
3. Ensure `apiEndpoint` is set correctly
4. Check CORS settings on your API

### Widget loads but chat doesn't work

1. Verify API endpoint is accessible
2. Check network tab for API request errors
3. Ensure `GROQ_API_KEY` is set in your environment
4. Verify CORS headers allow your domain

### Styling conflicts

The widget uses scoped CSS with Tailwind. If you experience conflicts:

```javascript
// Use a custom container with isolated styles
SmeduverseAI.init({
  apiEndpoint: 'https://your-domain.vercel.app/api/chat',
  containerId: 'isolated-widget-container'
});
```

### Performance optimization

```javascript
// Lazy load the widget
const loadWidget = () => {
  const script = document.createElement('script');
  script.src = 'https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js';
  script.async = true;
  script.onload = () => {
    SmeduverseAI.init({
      apiEndpoint: 'https://your-domain.vercel.app/api/chat'
    });
  };
  document.body.appendChild(script);
};

// Load on scroll or user interaction
window.addEventListener('scroll', loadWidget, { once: true });
```

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security

- The widget communicates with your API endpoint only
- No third-party tracking or analytics
- All data is transmitted over HTTPS
- API key is never exposed to the client

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
- GitHub Issues: [Your Repository]
- Documentation: [Your Docs URL]
- Email: support@smeduverse.com
