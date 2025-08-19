// Утилита для генерации тестовых данных для проверки виртуализации

export interface TestTask {
  id: number;
  text: string;
  notes?: string;
  project?: string;
  projectColor?: string;
  tags?: string[];
  files?: Array<{
    id: number;
    name: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  order: number;
}

export const generateTestTasks = (count: number): TestTask[] => {
  const projects = ['Личное', 'Работа', 'Домашние дела', 'Учеба', 'Хобби'];
  const projectColors = ['#A8D5BA', '#B8D4E8', '#C3E8D1', '#FFD93D', '#FF6B6B'];
  const tags = ['важное', 'срочно', 'идея', 'встреча', 'звонок', 'покупки', 'проект', 'анализ'];
  const fileTypes = ['pdf', 'doc', 'jpg', 'png', 'txt'];
  const fileNames = ['документ', 'отчет', 'фото', 'схема', 'заметка'];

  const tasks: TestTask[] = [];

  for (let i = 0; i < count; i++) {
    const hasNotes = Math.random() > 0.5;
    const hasProject = Math.random() > 0.3;
    const hasTags = Math.random() > 0.4;
    const hasFiles = Math.random() > 0.7;

    const task: TestTask = {
      id: Date.now() + i,
      text: `Тестовая задача ${i + 1} - ${generateRandomText(2, 4)}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      order: i
    };

    if (hasNotes) {
      task.notes = generateRandomText(8, 15);
    }

    if (hasProject) {
      const projectIndex = Math.floor(Math.random() * projects.length);
      task.project = projects[projectIndex];
      task.projectColor = projectColors[projectIndex];
    }

    if (hasTags) {
      const tagCount = Math.floor(Math.random() * 2) + 1; // Максимум 2 тега вместо 3
      task.tags = [];
      for (let j = 0; j < tagCount; j++) {
        const tag = tags[Math.floor(Math.random() * tags.length)];
        if (!task.tags!.includes(tag)) {
          task.tags!.push(tag);
        }
      }
    }

    if (hasFiles) {
      const fileCount = Math.floor(Math.random() * 2) + 1; // Максимум 2 файла вместо 3
      task.files = [];
      for (let j = 0; j < fileCount; j++) {
        const fileName = fileNames[Math.floor(Math.random() * fileNames.length)];
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        task.files!.push({
          id: Date.now() + i + j,
          name: `${fileName}_${i + 1}_${j + 1}.${fileType}`,
          type: `application/${fileType}`,
          size: Math.floor(Math.random() * 1000000) + 1000
        });
      }
    }

    tasks.push(task);
  }

  return tasks;
};

const generateRandomText = (minLength: number, maxLength: number): string => {
  const words = [
    'задача', 'проект', 'встреча', 'звонок', 'анализ', 'отчет', 'документ',
    'презентация', 'исследование', 'планирование', 'координация', 'разработка',
    'тестирование', 'внедрение', 'обучение', 'консультация', 'обзор', 'согласование'
  ];

  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let result = '';

  while (result.length < length) {
    const word = words[Math.floor(Math.random() * words.length)];
    if (result.length + word.length <= length) {
      result += (result ? ' ' : '') + word;
    } else {
      break;
    }
  }

  return result;
};

// Функция для добавления тестовых данных в localStorage
export const addTestData = (taskCount: number = 100) => {
  const testTasks = generateTestTasks(taskCount);
  
  // Распределяем задачи по разделам
  const todayCount = Math.floor(taskCount * 0.3);
  const todoCount = Math.floor(taskCount * 0.4);
  const doneCount = taskCount - todayCount - todoCount;

  const tasks = {
    today: testTasks.slice(0, todayCount),
    todo: testTasks.slice(todayCount, todayCount + todoCount),
    done: testTasks.slice(todayCount + todoCount)
  };

  localStorage.setItem('focus-tasks', JSON.stringify(tasks));
  
  console.log(`Добавлено ${taskCount} тестовых задач:`);
  console.log(`- Сегодня: ${todayCount}`);
  console.log(`- В планах: ${todoCount}`);
  console.log(`- Сделано: ${doneCount}`);
  
  return tasks;
};

// Функция для очистки тестовых данных
export const clearTestData = () => {
  localStorage.removeItem('focus-tasks');
  console.log('Тестовые данные очищены');
};

// Функция для создания реалистичных задач (похожих на пользовательские)
export const addRealisticTasks = () => {
  const realisticTasks = [
    {
      id: Date.now() + 1,
      text: 'Подготовить презентацию для встречи',
      notes: 'Нужно собрать данные за последний квартал и создать слайды для отчета о проделанной работе.',
      project: 'Работа',
      projectColor: '#B8D4E8',
      tags: ['важное', 'встреча', 'презентация'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      order: 0
    },
    {
      id: Date.now() + 2,
      text: 'Купить продукты на неделю',
      notes: 'Молоко, хлеб, яйца, овощи, мясо, крупы. Не забыть про корм для кота.',
      project: 'Домашние дела',
      projectColor: '#C3E8D1',
      tags: ['покупки', 'важное'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      order: 1
    },
    {
      id: Date.now() + 3,
      text: 'Позвонить маме',
      notes: 'Узнать как дела, рассказать о последних событиях.',
      project: 'Личное',
      projectColor: '#A8D5BA',
      tags: ['звонок', 'важное'],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      order: 2
    },
    {
      id: Date.now() + 4,
      text: 'Изучить новую технологию',
      notes: 'React 19, новые хуки и возможности. Посмотреть документацию и примеры.',
      project: 'Учеба',
      projectColor: '#FFD93D',
      tags: ['идея', 'проект'],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      order: 3
    },
    {
      id: Date.now() + 5,
      text: 'Запланировать отпуск',
      notes: 'Выбрать даты, забронировать отель, купить билеты. Рассмотреть варианты в Европе.',
      project: 'Личное',
      projectColor: '#A8D5BA',
      tags: ['важное', 'планирование'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      order: 4
    },
    {
      id: Date.now() + 6,
      text: 'Написать отчет о проделанной работе',
      notes: 'Собрать все данные, проанализировать результаты, подготовить выводы.',
      project: 'Работа',
      projectColor: '#B8D4E8',
      tags: ['отчет', 'анализ'],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      order: 5
    },
    {
      id: Date.now() + 7,
      text: 'Сделать уборку в квартире',
      notes: 'Пропылесосить, протереть пыль, помыть полы, постирать вещи.',
      project: 'Домашние дела',
      projectColor: '#C3E8D1',
      tags: ['важное'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      order: 6
    },
    {
      id: Date.now() + 8,
      text: 'Встретиться с друзьями',
      notes: 'Обсудить планы на выходные, возможно сходить в кино или ресторан.',
      project: 'Личное',
      projectColor: '#A8D5BA',
      tags: ['встреча'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      order: 7
    }
  ];

  // Распределяем задачи по разделам
  const tasks = {
    today: realisticTasks.slice(0, 3), // Первые 3 задачи на сегодня
    todo: realisticTasks.slice(3, 6),  // Следующие 3 задачи в планах
    done: realisticTasks.slice(6)      // Последние 2 задачи выполнены
  };

  localStorage.setItem('focus-tasks', JSON.stringify(tasks));
  
  console.log('Восстановлены реалистичные задачи:');
  console.log(`- Сегодня: ${tasks.today.length}`);
  console.log(`- В планах: ${tasks.todo.length}`);
  console.log(`- Сделано: ${tasks.done.length}`);
  
  return tasks;
};
