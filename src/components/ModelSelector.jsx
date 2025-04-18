import React from 'react';

const models = [
  { id: 'assistant', name: 'Assistant', description: 'General purpose AI assistant' },
  { id: 'teacher', name: 'Teacher', description: 'Educational and explanatory responses' },
  { id: 'creative', name: 'Creative', description: 'Creative and imaginative responses' },
];

export default function ModelSelector({ currentModel, onChangeModel }) {
  return (
    <div className="mb-4 bg-gray-50 p-3 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
      <div className="grid grid-cols-3 gap-2">
        {models.map((model) => (
          <button
            key={model.id}
            className={`px-3 py-2 text-sm rounded-md cursor-pointer focus:outline-none ${
              currentModel === model.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => onChangeModel(model.id)}
            title={model.description}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}