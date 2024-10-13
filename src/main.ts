type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
type TimeSlot = '8:30-10:00' | '10:15-11:45' | '12:15-13:45' | '14:00-15:30' | '15:45-17:15';
type CourseType = 'Lecture' | 'Seminar' | 'Lab' | 'Practice';

type Professor = {
  id: number;
  name: string;
  department: string;
};

type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

type Course = {
  id: number;
  name: string;
  type: CourseType;
};

type Lesson = {
  id: number;
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

type ScheduleConflict = {
  type: 'ProfessorConflict' | 'ClassroomConflict';
  lessonDetails: Lesson;
};

let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

function addProfessor(professor: Professor): void {
  if (professors.some(p => p.id === professor.id)) {
    throw new Error('Professor with this ID already exists');
  }
  professors.push(professor);
}

function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict === null) {
    schedule.push(lesson);
    return true;
  }
  return false;
}

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  // find occupied classrooms for the given time slot and day
  const occupiedClassrooms = schedule
    .filter(l => l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek)
    .map(l => l.classroomNumber);

  return classrooms
    .filter(c => !occupiedClassrooms.includes(c.number))
    .map(c => c.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter(lesson => lesson.professorId === professorId);
}

function validateLesson(lesson: Lesson): ScheduleConflict | null {
  // check for professor conflicts
  const professorConflict = schedule.find(l =>
    l.professorId === lesson.professorId &&
    l.dayOfWeek === lesson.dayOfWeek &&
    l.timeSlot === lesson.timeSlot,
  );

  if (professorConflict) {
    return {
      type: 'ProfessorConflict',
      lessonDetails: professorConflict,
    };
  }

  // check for classroom conflicts
  const classroomConflict = schedule.find(l =>
    l.classroomNumber === lesson.classroomNumber &&
    l.dayOfWeek === lesson.dayOfWeek &&
    l.timeSlot === lesson.timeSlot,
  );

  if (classroomConflict) {
    return {
      type: 'ClassroomConflict',
      lessonDetails: classroomConflict,
    };
  }

  return null;
}

function getClassroomUtilization(classroomNumber: string): number {
  const totalLessons = schedule.filter(
    (lesson) => lesson.classroomNumber === classroomNumber,
  ).length;
  const totalSlots = 5 * 8; // 5 days, each day has 8 slots
  return (totalLessons / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
  const courseTypeCounts = new Map<CourseType, number>();

  schedule.forEach(lesson => {
    const course = courses.find(c => c.id === lesson.courseId);
    if (course) {
      const currentCount = courseTypeCounts.get(course.type) || 0;
      courseTypeCounts.set(course.type, currentCount + 1);
    }
  });

  // find the course type with the highest count
  let maxCount = 0;
  let mostPopularType: CourseType = 'Lecture';

  courseTypeCounts.forEach((count, type) => {
    if (count > maxCount) {
      maxCount = count;
      mostPopularType = type;
    }
  });

  return mostPopularType;
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const lessonIndex = schedule.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) {
    console.log('Урок не знайдено');
    return false;
  }

  const newClassroom = classrooms.find(c => c.number === newClassroomNumber);
  if (!newClassroom) {
    console.log('Нова аудиторія не існує');
    return false;
  }

  const currentLesson = schedule[lessonIndex];

  // check for conflicts with the new classroom
  const hasConflict = schedule.some(l =>
    l.id !== lessonId && // exclude the current lesson
    l.dayOfWeek === currentLesson.dayOfWeek &&
    l.timeSlot === currentLesson.timeSlot &&
    l.classroomNumber === newClassroomNumber,
  );

  if (hasConflict) {
    console.log('Виявлено конфлікт: ClassroomConflict');
    return false;
  }

  // update the lesson with the new classroom
  schedule[lessonIndex] = {
    ...currentLesson,
    classroomNumber: newClassroomNumber,
  };

  return true;
}

function cancelLesson(lessonId: number): void {
  const lessonIndex = schedule.findIndex(l => l.id === lessonId);
  if (lessonIndex !== -1) {
    schedule.splice(lessonIndex, 1);
  }
}


function generateLessonId(): number {
  return Math.max(0, ...schedule.map(l => l.id)) + 1;
}


function demonstrateUsage(): void {
  console.log('=== Демонстрація роботи системи управління розкладом ===\n');

  console.log('1. Додавання професорів:');
  const professors: Professor[] = [
    { id: 1, name: 'Іван Петров', department: 'Комп\'ютерні науки' },
    { id: 2, name: 'Марія Іванова', department: 'Математика' },
    { id: 3, name: 'Олег Сидоров', department: 'Фізика' },
  ];

  professors.forEach(professor => {
    addProfessor(professor);
    console.log(`Додано професора: ${professor.name}`);
  });

  console.log('\n2. Додавання аудиторій:');
  classrooms.push(
    { number: '101', capacity: 30, hasProjector: true },
    { number: '102', capacity: 25, hasProjector: false },
    { number: '103', capacity: 40, hasProjector: true },
  );
  console.log('Додано аудиторії:', classrooms.map(c => c.number).join(', '));

  console.log('\n3. Додавання курсів:');
  courses.push(
    { id: 1, name: 'Програмування', type: 'Lecture' },
    { id: 2, name: 'Алгоритми', type: 'Practice' },
    { id: 3, name: 'Бази даних', type: 'Lecture' },
  );
  console.log('Додано курси:', courses.map(c => c.name).join(', '));

  console.log('\n4. Додавання занять:');
  const lesson1: Lesson = {
    id: generateLessonId(),
    courseId: 1,
    professorId: 1,
    classroomNumber: '101',
    dayOfWeek: 'Monday',
    timeSlot: '8:30-10:00',
  };

  const lesson2: Lesson = {
    id: generateLessonId(),
    courseId: 2,
    professorId: 2,
    classroomNumber: '102',
    dayOfWeek: 'Monday',
    timeSlot: '10:15-11:45',
  };

  const lesson3: Lesson = {
    id: generateLessonId(),
    courseId: 3,
    professorId: 3,
    classroomNumber: '103',
    dayOfWeek: 'Monday',
    timeSlot: '8:30-10:00',
  };

  addLesson(lesson1);
  addLesson(lesson2);
  addLesson(lesson3);
  console.log('Додано заняття до розкладу');

  console.log('\n5. Перевірка конфліктів:');
  const conflictLesson: Lesson = {
    id: generateLessonId(),
    courseId: 1,
    professorId: 1,
    classroomNumber: '101',
    dayOfWeek: 'Monday',
    timeSlot: '8:30-10:00',
  };

  const conflict = validateLesson(conflictLesson);
  console.log('Перевірка конфлікту:', conflict ? `Знайдено конфлікт типу ${conflict.type}` : 'Конфліктів немає');

  console.log('\n6. Пошук вільних аудиторій:');
  const availableRooms = findAvailableClassrooms('8:30-10:00', 'Monday');
  console.log('Вільні аудиторії на понеділок 8:30-10:00:', availableRooms);

  console.log('\n7. Розклад професора:');
  const professorSchedule = getProfessorSchedule(1);
  console.log(`Розклад професора Іван Петров (ID: 1):`,
    professorSchedule.map(l => `${l.dayOfWeek} ${l.timeSlot}`));

  console.log('\n8. Аналіз використання аудиторій:');
  const utilization = getClassroomUtilization('101');
  console.log(`Використання аудиторії 101: ${utilization.toFixed(2)}%`);

  console.log('\n9. Найпопулярніший тип занять:');
  const popularType = getMostPopularCourseType();
  console.log(`Найпопулярніший тип занять: ${popularType}`);

  console.log('\n10. Зміна аудиторії:');

  const successResult = reassignClassroom(lesson2.id, '103');
  console.log(`Спроба перепризначення: ${successResult ? 'Успішно' : 'Невдало'}`);

  console.log('\n11. Скасування заняття:');
  cancelLesson(lesson3.id);
  console.log(`Заняття скасовано (ID: ${lesson3.id})`);

  console.log('\n12. Фінальний стан розкладу:');
  console.log(`Всього занять у розкладі: ${schedule.length}`);
  schedule.forEach(lesson => {
    const course = courses.find(c => c.id === lesson.courseId);
    const professor = professors.find(p => p.id === lesson.professorId);
    console.log(`- ${course?.name} (${lesson.dayOfWeek} ${lesson.timeSlot}), Викладач: ${professor?.name}`);
  });
}


demonstrateUsage();