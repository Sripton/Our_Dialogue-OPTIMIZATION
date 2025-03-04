### `Команда ->` npx create-react-app client `развернет react приложение в папке client`

Creating a new React app in /Users/elmarerzikhanov/Desktop/PROJECTS/Our_Dialogue-OPTIMIZATION/client

### `Ошибка`

### Compiled with problems:

### × ERROR in ./src/reportWebVitals.js 5:4-24 Module not found: Error: Can't resolve 'web-vitals' in '/Users/

### `говорит о том, что модуль web-vitals не найден в  проекте. Это обычно происходит, если зависимость web-vitals не была установлена или была удалена`

### npm install web-vitals

### `Команда`client ls -a `покажет проинициализирован ли git в папке` client `Нужно ее удалить` rm -rf .git

### `В корне проекта ` git init


### Проблема возникщая с отображением реакций если 
[`1. Ошибка в fetchReactionsPosts Вы изменили метод загрузки реакций, добавив параметр post_id, но теперь fetchReactionsPosts загружает реакции только для одного поста. В PostContextProvider вызывался fetchReactionsPosts() без post_id, что ранее загружало все лайки и дизлайки. Теперь, если он вызывается с post_id, реакции загружаются только для одного поста, а другие остаются пустыми.

Решение: 1
Если хотите загружать все реакции сразу, оставьте fetchReactionsPosts без параметра и загружайте все реакции, как раньше:` 
Решение: 2
Если же хотите загружать реакции только для конкретного поста, то состояние likePost и dislikePost нужно хранить не глобально, а в Postscard, а то у всех постов используется одно состояние.]
