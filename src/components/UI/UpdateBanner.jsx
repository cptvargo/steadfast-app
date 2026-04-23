import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="update-banner">
      <span className="update-banner-text">A new version of Steadfast is ready.</span>
      <button className="update-banner-btn" onClick={() => updateServiceWorker(true)}>
        Update
      </button>
    </div>
  );
}
