import React, { useState, useRef, useEffect } from 'react';
import { STATUS_OPTIONS } from '../utils/formatters';
import { ChevronDown, Check } from 'lucide-react';

export const StatusBadge = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = STATUS_OPTIONS.find((opt) => opt.id === currentStatus) || {
    id: 'Not Tracked',
    label: 'Track Status',
    color: '#9ca3af',
    bg: 'rgba(255, 255, 255, 0.06)',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: 700,
          background: activeOption.bg,
          color: activeOption.color,
          border: `1px solid ${activeOption.color}33`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
      >
        <span>{activeOption.label}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: '6px',
          width: '160px',
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '0.4rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          zIndex: 50,
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, padding: '0.2rem 0.5rem', marginBottom: '0.2rem' }}>
            SET APPLICATION STATUS
          </div>
          {STATUS_OPTIONS.map((option) => {
            const isSelected = currentStatus === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(option.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: option.color,
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s'
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} color={option.color} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
