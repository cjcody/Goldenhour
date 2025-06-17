import React from 'react';

const AnimationDemo = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Animation Examples</h2>
      <div className="space-y-4">
        <div className="animate-fade-in p-4 bg-white rounded-lg shadow">
          This element fades in
        </div>
        <div className="animate-slide-up p-4 bg-white rounded-lg shadow">
          This element slides up
        </div>
        <div className="animate-slide-down p-4 bg-white rounded-lg shadow">
          This element slides down
        </div>
      </div>
    </section>
  );
};

export default AnimationDemo; 