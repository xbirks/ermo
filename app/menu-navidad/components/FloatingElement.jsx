export default function FloatingElement({ children, delay = 0, className = '' }) {
    const delayClass = delay > 0 ? `delay-${delay}` : '';

    return (
        <div className={`floating-element ${delayClass} ${className}`}>
            {children}
        </div>
    );
}
