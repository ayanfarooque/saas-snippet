import React from 'react';

export default function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Title skeleton */}
      <div
        className="animate-skeleton"
        style={{
          height: '16px',
          width: '65%',
          borderRadius: '4px',
          backgroundColor: 'var(--border-secondary)',
        }}
      />
      {/* Content lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          className="animate-skeleton"
          style={{
            height: '12px',
            width: '100%',
            borderRadius: '4px',
            backgroundColor: 'var(--border-primary)',
          }}
        />
        <div
          className="animate-skeleton"
          style={{
            height: '12px',
            width: '80%',
            borderRadius: '4px',
            backgroundColor: 'var(--border-primary)',
          }}
        />
      </div>
      {/* Tags skeleton */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <div
          className="animate-skeleton"
          style={{
            height: '20px',
            width: '60px',
            borderRadius: '99px',
            backgroundColor: 'var(--border-primary)',
          }}
        />
        <div
          className="animate-skeleton"
          style={{
            height: '20px',
            width: '48px',
            borderRadius: '99px',
            backgroundColor: 'var(--border-primary)',
          }}
        />
      </div>
      {/* Footer skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <div
          className="animate-skeleton"
          style={{
            height: '12px',
            width: '100px',
            borderRadius: '4px',
            backgroundColor: 'var(--border-primary)',
          }}
        />
        <div
          className="animate-skeleton"
          style={{
            height: '12px',
            width: '50px',
            borderRadius: '4px',
            backgroundColor: 'var(--border-primary)',
          }}
        />
      </div>
    </div>
  );
}
