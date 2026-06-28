// GLOBAL VARIABLES
let activeBtn = "words";
let letters = [];
let dialogues = [];
let wordsCounter = 0;
let dialoguesCounter = 0;
let currentLessonTitle = "";

// DOM ELEMENTS VARIABLES
const footerBtns = document.querySelectorAll(".footer_btn");
const wordsBtn = document.querySelector(".footer_btn_words");
const dialogsBtn = document.querySelector(".footer_btn_dialogs");
const repeatBtn = document.querySelector(".footer_btn_repeat");
const testBtn = document.querySelector(".footer_btn_test");
const appWindow = document.querySelector(".app_main");

// Lessons buttons

let lessonBtns = undefined;

// FOOTER BUTTONS LOGIC

// Underline active button

footerBtns.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    footerBtns.forEach((btn) => btn.classList.remove("footer_btn_active"));
    button.classList.add("footer_btn_active");
    activeBtn = button.dataset.value; // Take value from data-value
    console.log(activeBtn);

    const html = `
          <h2>Выберите уровень сложности</h2>
      <div class="app_main_lessons">
        <div class="lesson_btn hsk_1">
          <h3>HSK<br />1</h3>
        </div>
        <div class="lesson_btn hsk_2">
          <h3>HSK<br />2</h3>
        </div>
        <div class="lesson_btn hsk_3">
          <h3>HSK<br />3</h3>
        </div>
        <div class="lesson_btn hsk_4">
          <h3>HSK<br />4</h3>
        </div>
        <div class="lesson_btn hsk_5">
          <h3>HSK<br />5</h3>
        </div>
        <div class="lesson_btn hsk_6">
          <h3>HSK<br />6</h3>
        </div>
      </div>
    `;

    appWindow.innerHTML = html;
  });
});

// Lessons list creation

const createLessonsList = function (lessons, index) {
  appWindow.innerHTML = "";

  lessons.forEach((lesson) => {
    const html = `
        <div class="lesson" id=${lesson.id}>
          <h3>${lesson.hsk_level}. Урок №${lesson.lesson_number}</h3>
          <p>${lesson.title_ru}</p>
        </div>`;

    appWindow.insertAdjacentHTML("beforeend", html);
  });

  lessonBtns = document.querySelectorAll(".lesson");
};

// Функция для отрисовки текущего слова
const renderWordView = function () {
  const html = `
      <h3>${currentLessonTitle}</h3>
      <div class="word_cont">
        <ion-icon name="chevron-back-outline" class="backward_btn"></ion-icon>
        <p>${letters[wordsCounter].character}</p>
        <ion-icon name="chevron-forward-outline" class="forward_btn"></ion-icon>
      </div>

      <div class="word_meaning">
        <div class="word_meaning_translation">
          <h3>Перевод:</h3>
          <p>${letters[wordsCounter].translation}</p>
        </div>

        <div class="word_meaning_pinyin">
          <h3>Пиньинь:</h3>
          <p>${letters[wordsCounter].pinyin}</p>
        </div>

      </div>

      <button class="show_description_btn"><h3>Показать значение</h3></button>
      `;

  appWindow.innerHTML = html;
};

// Lesson click implementation

const lessonClick = function (lessons, charachters, dial) {
  lessonBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();

      const currentLesson = lessons.filter((lesson) => lesson.id === btn.id)[0];
      currentLessonTitle = `Урок ${currentLesson.lesson_number}. ${currentLesson.title_ru}`;

      switch (activeBtn) {
        case "words":
          wordsCounter = 0; // Сбрасываем счетчик при входе в урок

          letters = charachters.filter((charachter) => {
            const [level, lesson, char] = charachter.id.split("_");
            const charachter_id = level + "_" + lesson;
            return charachter_id === btn.id;
          });
          renderWordView();
          break;

        case "dialogs":
          dialogsCounter = 0;
          dialogues = dial.filter((dialogue) => dialogue.id === btn.id)[0]
            .dialogues;
          console.log(dialogues);
          renderDialogsView(dialogues, dialogsCounter);
          break;
      }
    });
  });
};

const renderDialogsView = function (dialogues, dialogsCounter) {
  let dialogueHtml = ``;

  dialogues[dialoguesCounter].forEach(
    (dialogue) =>
      (dialogueHtml += `
        <div class="dialogue_row">
          <h3>${dialogue.speaker}: </h3>
          <div>
            <p>${dialogue.character}</p>
            <p class="dialog_pinyin">${dialogue.pinyin}</p>
            <p class="dialog_translation">${dialogue.translation}</p>
          </div>
        </div>
    `),
  );

  const html = `
  <div class="dialogue_cont">    
    <div class="dialogue_window">
        ${dialogues.length > 1 ? `<ion-icon name="chevron-back-outline" class="backward_btn"></ion-icon>` : ""}
        
        <div class="dialogue">${dialogueHtml}</div>
        ${dialogues.length > 1 ? `<ion-icon name="chevron-forward-outline" class="forward_btn"></ion-icon>` : ""}
        
    </div>
    <button class="show_description_btn"><h3>Показать значение</h3></button>
  </div>
  `;
  appWindow.innerHTML = html;
};

// Делегирование события клика для кнопок HSK внутри appWindow
appWindow.addEventListener("click", function (event) {
  // Ищем ближайшего родителя с классом .hsk_1, если кликнули по дочернему элементу (например, h3)
  const hsk1Btn = event.target.closest(".hsk_1");

  const forwardBtn = event.target.closest(".forward_btn");
  const backwardBtn = event.target.closest(".backward_btn");

  const showDescriptionBtn = document.querySelector(".show_description_btn");

  if (hsk1Btn) {
    event.preventDefault();
    createLessonsList(hsk1_lessons);
    lessonClick(hsk1_lessons, hsk1_characters, hsk1_dialogues);
  }

  if (forwardBtn) {
    switch (activeBtn) {
      case "words":
        if (wordsCounter < letters.length - 1) {
          wordsCounter += 1;
          renderWordView();
        }
        break;

      case "dialogs":
        if (dialoguesCounter < dialogues.length - 1) {
          dialoguesCounter += 1;
          renderDialogsView(dialogues, dialogsCounter);
        }
        break;
    }
  }

  if (backwardBtn) {
    switch (activeBtn) {
      case "words":
        if (wordsCounter > 0) {
          wordsCounter -= 1;
          renderWordView();
        }
        break;

      case "dialogs":
        if (dialoguesCounter > 0) {
          dialoguesCounter -= 1;
          renderDialogsView(dialogues, dialogsCounter);
        }
        break;
    }
  }

  if (activeBtn === "dialogs" && showDescriptionBtn) {
    // Находим все элементы с классами .dialog_pinyin и .dialog_translation
    const allDialogPinyin = document.querySelectorAll(".dialog_pinyin");
    const allDialogTranslation = document.querySelectorAll(
      ".dialog_translation",
    );

    // Переключаем класс 'hidden' для каждого найденного элемента
    allDialogPinyin.forEach((el) => el.classList.toggle("hidden"));
    allDialogTranslation.forEach((el) => el.classList.toggle("hidden"));
    // Удаляем повторный вызов renderDialogsView, так как он перерисовывает весь контент
  }

  if (activeBtn === "words" && showDescriptionBtn) {
    const wordMeaning = document.querySelector(".word_meaning");
    wordMeaning.classList.toggle("hidden");
  }
});
