import React, { useState, useRef } from 'react';
import { Plus, Type, ImageIcon, Square, Circle, Trash2, Copy } from 'lucide-react';

interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  shapeType?: 'rectangle' | 'circle';
}

interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  backgroundColor: string;
}

const PresentationEditor: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'Слайд 1',
      elements: [
        {
          id: 'e1',
          type: 'text',
          content: 'Заголовок презентации',
          x: 50,
          y: 50,
          width: 600,
          height: 80,
          fontSize: 48,
          color: '#1f2937',
        },
      ],
      backgroundColor: '#ffffff',
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentSlideIndex];

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Слайд ${slides.length + 1}`,
      elements: [],
      backgroundColor: '#ffffff',
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, index - 1));
  };

  const duplicateSlide = (index: number) => {
    const slideToDuplicate = slides[index];
    const newSlide: Slide = {
      ...slideToDuplicate,
      id: Date.now().toString(),
      title: `${slideToDuplicate.title} (копия)`,
      elements: slideToDuplicate.elements.map(el => ({
        ...el,
        id: Date.now().toString() + Math.random(),
      })),
    };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(index + 1);
  };

  const addElement = (type: 'text' | 'image' | 'shape', shapeType?: 'rectangle' | 'circle') => {
    const newElement: SlideElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Новый текст' : type === 'image' ? 'https://via.placeholder.com/200' : '',
      x: 100,
      y: 100,
      width: type === 'text' ? 300 : 200,
      height: type === 'text' ? 60 : 200,
      fontSize: 24,
      color: '#000000',
      backgroundColor: type === 'shape' ? '#3b82f6' : 'transparent',
      shapeType,
    };

    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].elements.push(newElement);
    setSlides(updatedSlides);
    setSelectedElement(newElement.id);
  };

  const updateElement = (elementId: string, updates: Partial<SlideElement>) => {
    const updatedSlides = [...slides];
    const elementIndex = updatedSlides[currentSlideIndex].elements.findIndex(
      el => el.id === elementId
    );
    if (elementIndex !== -1) {
      updatedSlides[currentSlideIndex].elements[elementIndex] = {
        ...updatedSlides[currentSlideIndex].elements[elementIndex],
        ...updates,
      };
      setSlides(updatedSlides);
    }
  };

  const deleteElement = (elementId: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].elements = updatedSlides[
      currentSlideIndex
    ].elements.filter(el => el.id !== elementId);
    setSlides(updatedSlides);
    setSelectedElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElement(elementId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;

    const element = currentSlide.elements.find(el => el.id === selectedElement);
    if (!element) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    updateElement(selectedElement, {
      x: element.x + deltaX,
      y: element.y + deltaY,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedEl = currentSlide.elements.find(el => el.id === selectedElement);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Панель слайдов */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <button
            onClick={addSlide}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Новый слайд
          </button>
        </div>
        <div className="space-y-2 px-4 pb-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => setCurrentSlideIndex(index)}
              className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                index === currentSlideIndex
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-video bg-white p-2">
                <div
                  className="w-full h-full rounded"
                  style={{ backgroundColor: slide.backgroundColor }}
                >
                  <div className="text-xs p-2 overflow-hidden">
                    {slide.elements.map(el => (
                      <div key={el.id} className="truncate">
                        {el.content.substring(0, 20)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-2 py-1 text-sm font-medium text-gray-700">
                {index + 1}. {slide.title}
              </div>
              <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(index);
                  }}
                  className="p-1 bg-white rounded shadow hover:bg-gray-100"
                  title="Дублировать"
                >
                  <Copy size={14} />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(index);
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-red-100"
                    title="Удалить"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col">
        {/* Панель инструментов */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => addElement('text')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Type size={20} />
              Текст
            </button>
            <button
              onClick={() => addElement('image')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ImageIcon size={20} />
              Изображение
            </button>
            <button
              onClick={() => addElement('shape', 'rectangle')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Square size={20} />
              Прямоугольник
            </button>
            <button
              onClick={() => addElement('shape', 'circle')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Circle size={20} />
              Круг
            </button>
            {selectedElement && (
              <button
                onClick={() => deleteElement(selectedElement)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors ml-auto"
              >
                <Trash2 size={20} />
                Удалить элемент
              </button>
            )}
          </div>
        </div>

        {/* Холст */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-2xl"
              style={{
                width: '960px',
                height: '540px',
                backgroundColor: currentSlide.backgroundColor,
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedElement(null)}
            >
              {currentSlide.elements.map(element => (
                <div
                  key={element.id}
                  onMouseDown={(e) => handleMouseDown(e, element.id)}
                  className={`absolute cursor-move ${
                    selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                  }}
                >
                  {element.type === 'text' && (
                    <textarea
                      value={element.content}
                      onChange={(e) =>
                        updateElement(element.id, { content: e.target.value })
                      }
                      className="w-full h-full resize-none border-none outline-none bg-transparent"
                      style={{
                        fontSize: element.fontSize,
                        color: element.color,
                        fontFamily: 'sans-serif',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {element.type === 'image' && (
                    <img
                      src={element.content}
                      alt="slide element"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {element.type === 'shape' && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: element.backgroundColor,
                        borderRadius: element.shapeType === 'circle' ? '50%' : '0',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Панель свойств */}
        {selectedEl && (
          <div className="bg-white border-t border-gray-200 p-4">
            <h3 className="font-semibold mb-3">Свойства элемента</h3>
            <div className="grid grid-cols-4 gap-4">
              {selectedEl.type === 'text' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Размер шрифта</label>
                    <input
                      type="number"
                      value={selectedEl.fontSize}
                      onChange={(e) =>
                        updateElement(selectedEl.id, { fontSize: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Цвет</label>
                    <input
                      type="color"
                      value={selectedEl.color}
                      onChange={(e) =>
                        updateElement(selectedEl.id, { color: e.target.value })
                      }
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              )}
              {selectedEl.type === 'shape' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Цвет заливки</label>
                  <input
                    type="color"
                    value={selectedEl.backgroundColor}
                    onChange={(e) =>
                      updateElement(selectedEl.id, { backgroundColor: e.target.value })
                    }
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Ширина</label>
                <input
                  type="number"
                  value={selectedEl.width}
                  onChange={(e) =>
                    updateElement(selectedEl.id, { width: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Высота</label>
                <input
                  type="number"
                  value={selectedEl.height}
                  onChange={(e) =>
                    updateElement(selectedEl.id, { height: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationEditor;