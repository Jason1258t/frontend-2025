import { createMinimalPresentation, createMaximalPresentation, createTestSlide, createTestTextObject, createTestTheme } from './testData';
import { changeTitle } from '../utils/changeTitle';
import { addContentToSlide, removeContentFromSlide, moveObject } from '../utils/content';
import { addSlide, removeSlide, moveSlide, changeBackground } from '../utils/slides';
import { changeTextValue, changeFontSize, changeFontFamily } from '../utils/text';

type TestResult = {
  name: string;
  success: boolean;
  error?: string;
};

class TestRunner {
  private tests: Array<{ name: string; fn: () => void }> = [];
  private results: TestResult[] = [];

  addTest(name: string, fn: () => void) {
    this.tests.push({ name, fn });
  }

  run() {
    console.log('🚀 Запуск тестов...\n');
    
    for (const test of this.tests) {
      try {
        test.fn();
        this.results.push({ name: test.name, success: true });
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.results.push({ 
          name: test.name, 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
        console.log(`❌ ${test.name}`);
        console.log(`   Ошибка: ${error}`);
      }
    }

    this.printSummary();
  }

  private printSummary() {
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    
    console.log('\n📊 Результаты тестов:');
    console.log(`✅ Пройдено: ${passed}`);
    console.log(`❌ Провалено: ${failed}`);
    
    if (failed > 0) {
      console.log('\n🔍 Детали проваленных тестов:');
      this.results.filter(r => !r.success).forEach(result => {
        console.log(`   ${result.name}: ${result.error}`);
      });
    }
    
    console.log(`\n${failed === 0 ? '🎉 Все тесты пройдены!' : '💥 Есть проваленные тесты!'}`);
  }
}

// Создаем экземпляр тестового раннера
const runner = new TestRunner();

// Тесты для changeTitle
runner.addTest('changeTitle с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const result = changeTitle(presentation, 'Новый заголовок');
  
  if (result.title !== 'Новый заголовок') {
    throw new Error('Заголовок не изменился');
  }
  
  if (result.updatedAt === presentation.updatedAt) {
    throw new Error('Дата обновления не изменилась');
  }
  
  if (result === presentation) {
    throw new Error('Объект не был скопирован (мутация)');
  }
});

runner.addTest('changeTitle с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const result = changeTitle(presentation, 'Новый заголовок для максимальных данных');
  
  if (result.title !== 'Новый заголовок для максимальных данных') {
    throw new Error('Заголовок не изменился');
  }
  
  if (result.description !== presentation.description) {
    throw new Error('Описание изменилось (не должно было)');
  }
  
  if (result.slidesCollection.slides.length !== presentation.slidesCollection.slides.length) {
    throw new Error('Количество слайдов изменилось');
  }
});

// Тесты для addContentToSlide
runner.addTest('addContentToSlide с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  const content = createTestTextObject();
  
  const result = addContentToSlide(presentation, slideId, content);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  
  if (!slide) throw new Error('Слайд не найден');
  if (slide.content.length !== 1) throw new Error('Контент не добавился');
  if (slide.content[0].id !== content.id) throw new Error('Добавился не тот объект');
});

runner.addTest('addContentToSlide с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideId = 'slide-1';
  const originalLength = presentation.slidesCollection.slides.find(s => s.id === slideId)!.content.length;
  const content = createTestTextObject();
  
  const result = addContentToSlide(presentation, slideId, content);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  
  if (!slide) throw new Error('Слайд не найден');
  if (slide.content.length !== originalLength + 1) {
    throw new Error(`Ожидалось ${originalLength + 1} объектов, получилось ${slide.content.length}`);
  }
});

// Тесты для removeContentFromSlide
runner.addTest('removeContentFromSlide с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  const content = createTestTextObject();
  
  // Сначала добавляем контент
  const presentationWithContent = addContentToSlide(presentation, slideId, content);
  // Потом удаляем
  const result = removeContentFromSlide(presentationWithContent, slideId, content.id);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  
  if (!slide) throw new Error('Слайд не найден');
  if (slide.content.length !== 0) throw new Error('Контент не удалился');
});

runner.addTest('removeContentFromSlide с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideId = 'slide-1';
  const objectIdToRemove = 'object-1';
  const originalLength = presentation.slidesCollection.slides.find(s => s.id === slideId)!.content.length;
  
  const result = removeContentFromSlide(presentation, slideId, objectIdToRemove);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  
  if (!slide) throw new Error('Слайд не найден');
  if (slide.content.length !== originalLength - 1) {
    throw new Error(`Ожидалось ${originalLength - 1} объектов, получилось ${slide.content.length}`);
  }
  
  const removedObject = slide.content.find(c => c.id === objectIdToRemove);
  if (removedObject) throw new Error('Объект не был удален');
});

// Тесты для moveObject
runner.addTest('moveObject с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  const content = createTestTextObject();
  const newPosition = { x: 100, y: 200 };
  
  const presentationWithContent = addContentToSlide(presentation, slideId, content);
  const result = moveObject(presentationWithContent, slideId, content.id, newPosition);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  const movedObject = slide!.content.find(c => c.id === content.id);
  
  if (movedObject!.position.x !== newPosition.x || movedObject!.position.y !== newPosition.y) {
    throw new Error('Позиция не изменилась');
  }
});

// Тесты для addSlide
runner.addTest('addSlide с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const newSlide = createTestSlide();
  const originalLength = presentation.slidesCollection.slides.length;
  
  const result = addSlide(presentation, newSlide);
  
  if (result.slidesCollection.slides.length !== originalLength + 1) {
    throw new Error('Слайд не добавился');
  }
  
  if (result.slidesCollection.slides[originalLength].id !== newSlide.id) {
    throw new Error('Добавился не тот слайд');
  }
});

runner.addTest('addSlide с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const newSlide = createTestSlide();
  const originalLength = presentation.slidesCollection.slides.length;
  
  const result = addSlide(presentation, newSlide);
  
  if (result.slidesCollection.slides.length !== originalLength + 1) {
    throw new Error('Слайд не добавился');
  }
});

// Тесты для removeSlide
runner.addTest('removeSlide с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  
  const result = removeSlide(presentation, slideId);
  
  if (result.slidesCollection.slides.length !== 0) {
    throw new Error('Слайд не удалился');
  }
  
  if (result.currentSlideId === slideId) {
    throw new Error('currentSlideId не изменился после удаления текущего слайда');
  }
});

runner.addTest('removeSlide с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideId = 'slide-1';
  const originalLength = presentation.slidesCollection.slides.length;
  
  const result = removeSlide(presentation, slideId);
  
  if (result.slidesCollection.slides.length !== originalLength - 1) {
    throw new Error('Слайд не удалился');
  }
  
  if (result.currentSlideId === slideId) {
    throw new Error('currentSlideId не изменился после удаления текущего слайда');
  }
});

// Тесты для moveSlide
runner.addTest('moveSlide с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  // Добавим второй слайд для теста перемещения
  const newSlide = { ...createTestSlide(), id: 'minimal-slide-2' };
  const presentationWithTwoSlides = addSlide(presentation, newSlide);
  const slideIdToMove = 'minimal-slide-2';
  
  const result = moveSlide(presentationWithTwoSlides, slideIdToMove, 0);
  
  if (result.slidesCollection.slides[0].id !== slideIdToMove) {
    throw new Error('Слайд не переместился на первую позицию');
  }
  
  if (result.slidesCollection.slides[1].id !== 'minimal-slide-1') {
    throw new Error('Второй слайд не переместился на вторую позицию');
  }
});

runner.addTest('moveSlide с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideIdToMove = 'slide-2';
  
  const result = moveSlide(presentation, slideIdToMove, 0);
  
  if (result.slidesCollection.slides[0].id !== slideIdToMove) {
    throw new Error('Слайд не переместился на первую позицию');
  }
  
  if (result.slidesCollection.slides[1].id !== 'slide-1') {
    throw new Error('Первый слайд не переместился на вторую позицию');
  }
  
  // Проверяем, что порядок сохранился корректно
  const slideIds = result.slidesCollection.slides.map(slide => slide.id);
  if (slideIds[0] !== 'slide-2' || slideIds[1] !== 'slide-1') {
    throw new Error('Неправильный порядок слайдов после перемещения');
  }
});

// Тесты для changeBackground
runner.addTest('changeBackground с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  const newTheme = createTestTheme();
  
  const result = changeBackground(presentation, slideId, newTheme);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  
  if (slide!.theme.id !== newTheme.id) {
    throw new Error('Тема не изменилась');
  }
  
  if (slide!.theme.color !== newTheme.color) {
    throw new Error('Цвет темы не изменился');
  }
});

runner.addTest('changeBackground с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideId = 'slide-1';
  const newTheme = createTestTheme();
  
  const result = changeBackground(presentation, slideId, newTheme);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  
  if (slide!.theme.id !== newTheme.id) {
    throw new Error('Тема не изменилась');
  }
  
  // Проверяем, что тема другого слайда не изменилась
  const otherSlide = result.slidesCollection.slides.find(s => s.id === 'slide-2');
  if (otherSlide!.theme.id === newTheme.id) {
    throw new Error('Тема другого слайда изменилась (не должна была)');
  }
});

// Тесты для текстовых функций
runner.addTest('changeTextValue с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  const textObject = createTestTextObject();
  
  const presentationWithText = addContentToSlide(presentation, slideId, textObject);
  const newValue = 'Новый текст';
  
  const result = changeTextValue(presentationWithText, slideId, textObject.id, newValue);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  const updatedObject = slide!.content.find(c => c.id === textObject.id);
  const textContent = updatedObject!.content as any;
  
  if (textContent.value !== newValue) {
    throw new Error('Текст не изменился');
  }
});

runner.addTest('changeTextValue с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideId = 'slide-1';
  const objectId = 'object-1';
  const newValue = 'Новый текст';
  
  const result = changeTextValue(presentation, slideId, objectId, newValue);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  const textObject = slide!.content.find(c => c.id === objectId);
  const textContent = textObject!.content as any;
  
  if (textContent.value !== newValue) {
    throw new Error('Текст не изменился');
  }
});

runner.addTest('changeFontSize с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  const textObject = createTestTextObject();
  
  const presentationWithText = addContentToSlide(presentation, slideId, textObject);
  const newSize = 32;
  
  const result = changeFontSize(presentationWithText, slideId, textObject.id, newSize);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  const updatedObject = slide!.content.find(c => c.id === textObject.id);
  const textContent = updatedObject!.content as any;
  
  if (textContent.fontSize !== newSize) {
    throw new Error('Размер шрифта не изменился');
  }
});

runner.addTest('changeFontSize с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideId = 'slide-1';
  const objectId = 'object-1';
  const newSize = 32;
  
  const result = changeFontSize(presentation, slideId, objectId, newSize);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  const textObject = slide!.content.find(c => c.id === objectId);
  const textContent = textObject!.content as any;
  
  if (textContent.fontSize !== newSize) {
    throw new Error('Размер шрифта не изменился');
  }
});

// Тесты для changeFontFamily
runner.addTest('changeFontFamily с минимальными данными', () => {
  const presentation = createMinimalPresentation();
  const slideId = 'minimal-slide-1';
  const textObject = createTestTextObject();
  
  const presentationWithText = addContentToSlide(presentation, slideId, textObject);
  const newFontFamily = 'Times New Roman';
  
  const result = changeFontFamily(presentationWithText, slideId, textObject.id, newFontFamily);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  const updatedObject = slide!.content.find(c => c.id === textObject.id);
  const textContent = updatedObject!.content as any;
  
  if (textContent.fontFamily !== newFontFamily) {
    throw new Error('Шрифт не изменился');
  }
});

runner.addTest('changeFontFamily с максимальными данными', () => {
  const presentation = createMaximalPresentation();
  const slideId = 'slide-1';
  const objectId = 'object-1';
  const newFontFamily = 'Courier New';
  
  const result = changeFontFamily(presentation, slideId, objectId, newFontFamily);
  const slide = result.slidesCollection.slides.find(s => s.id === slideId);
  const textObject = slide!.content.find(c => c.id === objectId);
  const textContent = textObject!.content as any;
  
  if (textContent.fontFamily !== newFontFamily) {
    throw new Error('Шрифт не изменился');
  }
  
  // Проверяем, что другие свойства текста не изменились
  if (textContent.value !== 'Hello World') {
    throw new Error('Текст изменился (не должен был)');
  }
  
  if (textContent.fontSize !== 16) {
    throw new Error('Размер шрифта изменился (не должен был)');
  }
});

// Экспортируем runner для запуска
export default runner;