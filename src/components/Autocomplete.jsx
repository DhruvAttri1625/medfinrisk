import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Typeahead autocomplete input.
 * Props:
 *  - value       {string}
 *  - onChange    {function(string)}
 *  - options     {string[]}
 *  - placeholder {string}
 */
export default function Autocomplete({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const filtered = useMemo(() => {
    if (!value) return options.slice(0, 12);
    const q = value.toLowerCase();
    return options.filter(o => o.toLowerCase().includes(q)).slice(0, 10);
  }, [value, options]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="ac-wrap" ref={ref}>
      <input
        className="inp"
        value={value}
        placeholder={placeholder}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className="ac-drop">
          {filtered.map(o => (
            <div
              key={o}
              className="ac-item"
              onMouseDown={() => { onChange(o); setOpen(false); }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
