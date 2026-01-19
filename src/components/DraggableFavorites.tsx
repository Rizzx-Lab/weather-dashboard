import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FavoriteCity } from '@/store/slices/favoritesSlice';
import { FiMapPin, FiX, FiMenu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface DraggableFavoritesProps {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (cityId: number) => void;
  onReorder: (favorites: FavoriteCity[]) => void;
}

const DraggableFavorites: React.FC<DraggableFavoritesProps> = ({
  favorites,
  onSelect,
  onRemove,
  onReorder,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(favorites);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            Favorite Cities
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Drag to reorder • Click to view
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                   text-gray-700 dark:text-gray-300 hover:bg-gray-200 
                   dark:hover:bg-gray-600 transition-colors"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="favorites">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              <AnimatePresence>
                {favorites.map((city, index) => (
                  <Draggable
                    key={city.id}
                    draggableId={city.id.toString()}
                    index={index}
                    isDragDisabled={!isEditing}
                  >
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: snapshot.isDragging ? 1.05 : 1,
                        }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className={`relative group rounded-xl p-4 transition-all ${
                          snapshot.isDragging
                            ? 'bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isEditing && (
                              <div {...provided.dragHandleProps}>
                                <FiMenu className="text-gray-400 cursor-move" />
                              </div>
                            )}
                            <FiMapPin className="text-blue-500" />
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-white">
                                {city.name}, {city.country}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <span>🌡 {city.weather.temp.toFixed(1)}°C</span>
                                <span>🕐 {new Date(city.lastUpdated).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onSelect(city)}
                              className="px-4 py-2 rounded-lg bg-blue-500 text-white 
                                       hover:bg-blue-600 transition-colors"
                            >
                              View
                            </button>
                            
                            {isEditing && (
                              <button
                                onClick={() => onRemove(city.id)}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 
                                         hover:text-red-600 transition-colors"
                              >
                                <FiX />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Weather condition indicator */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">
                              {city.weather.description}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-500 dark:text-gray-400">
                                Updated recently
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {favorites.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <FiMapPin className="text-4xl mx-auto" />
          </div>
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No favorite cities yet
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Add cities to your favorites to see them here
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DraggableFavorites;