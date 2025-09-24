import React, { useState } from 'react';

function TabPanel({ tabs, defaultTab = null }) {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.id || ''));

  return (
    <div className="aisb-tab-panel">
      <div className="aisb-tab-panel__header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`aisb-tab-panel__tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.icon && (
              <span className={`dashicons dashicons-${tab.icon}`}></span>
            )}
            <span className="aisb-tab-panel__tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="aisb-tab-panel__content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`aisb-tab-panel__pane ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabPanel;