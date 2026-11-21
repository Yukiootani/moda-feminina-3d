import React from 'react';

/**
 * ErrorBoundary para Canvas WebGL (iOS Safari / dispositivos mobile).
 * Caso o contexto WebGL falhe ou oscile, exibe automaticamente um fallback visual elegante.
 */
export default class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('[Harumi Modas WebGL Fallback]', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
