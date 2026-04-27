import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught a render error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f5f4f0', fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="text-center px-6" style={{ maxWidth: '560px' }}>
          <h1
            className="font-extrabold tracking-tight"
            style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', color: '#131931', lineHeight: 1 }}
          >
            Algo salió mal
          </h1>
          <p className="text-base mt-4" style={{ color: '#131931' }}>
            Ocurrió un error inesperado al renderizar esta vista.
          </p>
          <p className="text-sm mt-2" style={{ color: '#8a8fa3' }}>
            Puedes intentar volver al inicio. Si el problema persiste, contacta al equipo de soporte.
          </p>
          {this.state.error?.message && (
            <pre
              style={{
                marginTop: '20px',
                padding: '12px 14px',
                background: '#fff',
                border: '1px solid #e2dfff',
                borderRadius: '10px',
                color: '#ba1a1a',
                fontSize: '12px',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-block mt-8 px-8 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #131931 0%, #1F9DB9 100%)',
              boxShadow: '0 4px 12px rgba(19,25,49,0.2)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
}
