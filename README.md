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
Если хотите загружать все реакции сразу, оставьте fetchReactionsPosts без параметра и загружайть все реакции, как раньше:`
Решение: 2
Если же хотите загружать реакции только для конкретного поста, то состояние likePost и dislikePost нужно хранить не глобально, а в Postscard, а то у всех постов используется одно состояние.]

### РЕРЕНДЕРИНГ

### Проверка ререндеринга компонента Postcard.jsx. Пропс {post} не меняется.

[`шаг — увидеть, меняется ли post в компоненте Postcard.jsx`]
function areEqual(prevProps, nextProps) {
console.log("🧪 areEqual called");`

return !Object.keys(prevProps).some((key) => {
const isDifferent = prevProps[key] !== nextProps[key];
if (isDifferent) {
console.log(`❗ Prop "${key}" changed`);
console.log("Previous:", prevProps[key]);
console.log("Next:", nextProps[key]);
}
return isDifferent;
});
}

[`Если выводится результат ❗ Prop "post" changed`]
[`значит, что объект post меняется — возможно, потому что:`]
[`Новый объект создаётся в родителе ({ ...post })`]
[`Или меняются его вложенные поля (например, postLikes, User.name, Subject.subjectName и т.д.)`]

[`props.post не изменился (по ссылке) между предыдущим и следующим рендером.`]
[`А значит:`]
[`areEqual возвращает true`]
[`React.memo(Postscard, areEqual) блокирует повторный ререндер`]
[`Компонент Postscard не перерисовывается`]

[`console.log("Item Postcard") появляется каждый раз при обновлении чего-то, например, при отправке комментария.`]
[`Это может быть не из-за props.post, а потому что:`]
[`❗ useContext(PostContext) используется внутри Postscard, и контекст меняется, вызывая вынужденный ререндер независимо от props.`]

💡 Ключевое: React.memo не блокирует ререндер, вызванный useContext
Поэтому даже если props.post не меняется, ты всё равно получаешь console.log("Item Postcard"), потому что:
В PostContextProvider вызван, например, setLikePost(...)
Это обновляет весь контекст
Все подписчики (useContext(...)) получают новые значения
Следовательно, Postscard ререндерится — мимо React.memo и areEqual

✅ Как подтвердить, что контекст виноват:
Сравни старые и новые значения в useEffect:

useEffect(() => {
console.log("🔁 likePost changed", likePost);
}, [likePost]);

useEffect(() => {
console.log("🔁 editPostText changed", editPostText);
}, [editPostText]);

### Тестирвание данных из useContext с помошью useEffect

[`у меня 4 поста.`]
useEffect(() => {
console.log('likePost', likePost);
}, [likePost]); [`я добавил данный useEffect и у меня в консоли вышло 4 раза это`]
0:
{id: 2, user_id: 2, post_id: 2, reaction_type: 'like', createdAt: '2025-05-13T09:36:07.721Z', …}
length: 1[[Prototype]]:
Array(0)

✅ Что это значит
[`Ты видишь 4 срабатывания useEffect в компоненте Postscard, потому что:`]
[`У тебя 4 поста`]
[`Каждый пост отображается с помощью одного экземпляра Postscard`]
[`И каждый из них вызывает useContext(PostContext), а значит:`]

[`Когда likePost обновляется в контексте — все 4 компонента Postscard перерисовываются и каждый вызывает useEffect(..., [likePost])`]

[`🔍 Почему likePost — массив из 1 элемента
Потому что получаю его из контекста в момент, когда в нём был только один лайк`]

🧠 Значит ли это, что 4 рендера избыточны?
Да, если:
Ты хочешь, чтобы перерисовывался только тот пост, у которого обновился лайк
А не все 4 Postscard-а

✅ Как оптимизировать (2 варианта)
🔹 Вариант 1: Пробрасывать нужные данные в props
В родителе (например, в PostList.jsx):

<Postscard
post={post}
postLikes={likePost.filter((like) => like.post_id === post.id)}
postDislikes={dislikePost.filter((dislike) => dislike.post_id === post.id)}
userIDSession={userIDSession}
...
/>
И убрать useContext из Postscard.

Теперь React.memo(Postscard) будет сравнивать только props, и если у поста не изменился postLikes — рендер не произойдёт.

### Тестирование 3

Принял likePost и dislikePost из useContext не в компоненте Postcard.jsx а в родительском
компоненте Postlist.jsx
<Postscard
key={post.id}
post={post}
postLikes={likePost.filter((like) => (like.post_id === post.id))}
postDislikes={dislikePost.filter(
(dislike) => (dislike.post_id === post.id)
)}
/>
❗ Почему postLikes !== prevProps.postLikes?
postLikes={likePost.filter((like) => like.post_id === post.id)}
Каждый вызов .filter() возвращает новый массив в памяти, даже если его содержимое одинаковое. Следовательно:
[prevProps.postLikes === nextProps.postLikes // всегда false при любом ререндере]

✅ Как это исправить?
Вариант 1: Мемоизация результата фильтрации
Использовать useMemo в Postslist, чтобы кэшировать postLikes/postDislikes:
return (

<div className="posts-container">
{posts?.length &&
posts?.map((post) => {
const postLikes = useMemo(
() => likePost.filter((like) => like.post_id === post.id),
[likePost, post.id]
);
const postDislikes = useMemo(
() => dislikePost.filter((dislike) => dislike.post_id === post.id),
[dislikePost, post.id]
);

          return (
            <Postscard
              key={post.id}
              post={post}
              postLikes={postLikes}
              postDislikes={postDislikes}
            />
          );
        })}
    </div>

);
После внесения изменений и использования useMemo проблема не решилась
function areEqual(prevProps, nextProps) {
console.log(prevProps.post === nextProps.post); // true
console.log(prevProps.postLikes.length === nextProps.postLikes.length); // false
console.log(prevProps.postDislikes.length === nextProps.postDislikes.length); // false
}

🔍 Проблема: useMemo внутри .map() не кеширует
useMemo не работает как ожидалось, если вызываем его внутри .map() — React не сохраняет мемоизацию между рендерами для каждого элемента списка, потому что каждый useMemo связан с конкретным вызовом компонента, а не с конкретным post.

✳️ Подтверждение:
React Hook useMemo кэширует результат внутри конкретного рендера компонента. При следующем рендере Postslist, он пересоздаёт .map() и заново вызывает useMemo для каждого post. Поэтому ссылки снова разные.

🔍 Решение 1. Не корректный вызов функции areEqual
Важно не сами реакции а их ко-во. А оно не изменеятся
function areEqual(prevProps, nextProps) {
console.log(prevProps.post === nextProps.post); // true
console.log(prevProps.postLikes.length === nextProps.postLikes.length); // true
console.log(prevProps.postDislikes.length === nextProps.postDislikes.length); // true
}
✅ Когда текущий способ с filter + useMemo в map() — достаточен?
Когда реакции мало (до нескольких сотен)
Когда важна только длина (.length) массива
Когда Postscard сам не делает тяжёлую работу внутри, зависящую от содержимого postLikes

🧠 Когда всё же имеет смысл использовать postLikesMap?
🔍 Решение 2. мемоизировать вне .map()
Перед return, создать один объект с кэшированными результатами для всех post.id, чтобы гарантировать ссылочную стабильность:

const postLikesMap = useMemo(() => {
const map = {};
for (const like of likePost) {
if (!map[like.post_id]) map[like.post_id] = [];
map[like.post_id].push(like);
}
return map;
}, [likePost]);

1. Много постов и реакций, и filter() вызывается много раз (на каждый рендер)
2. Ты передаёшь одни и те же postLikes в несколько компонентов (чтобы кэшировать сразу все)
3. Хочешь лучший контроль за ссылочной идентичностью:
   postLikesMap[post.id] === prevPostLikesMap[post.id]

Тогда postLikesMap обеспечивает гарантированную стабильность ссылок что помогает memo точнее понимать — нужно ли ререндерить компонент.

✅ Что делает useMemo
const postLikesMap = useMemo(() => {
// вычисления
return map;
}, [likePost]);

1.  React запомнит (memoize) результат вызова этой функции (в данном случае — map).
2.  При следующем рендере компонента:
    [`React сравнит likePost с прошлым значением.`]
    [`Если likePost не изменился (по ссылке) — useMemo вернёт старый map, не вызывая функцию заново.`]
    [`Если likePost изменился — функция снова будет вызвана, map пересоздастся, и новый результат будет сохранён.`]

🔁 Что кешируется?
Не сама функция, а результат её выполнения, то есть объект postLikesMap.
💡 И что это даёт?

- `Если ты передаёшь postLikesMap[post.id] в дочерний компонент, то:`
- `Если likePost не изменился, postLikesMap будет та же ссылка, и postLikesMap[post.id] тоже.`

- `Это позволяет предотвратить ререндеры в компонентах с React.memo.`

### Рефакторинг Postcard.jsx

[`Вынес fetchReactionsPosts из Postscard.jsx`]

- Postscard не должен сам вызывать глобальный эффект;
- fetchReactionsPosts() уже вызывается в submitPostReaction, что гарантирует обновление лайков/дизлайков после любой реакции.

### нужно ли оборачивать submitPostReaction, deletePostHandler, editPostText, setEditPostText в useCallback?

- Эти функции уже создаются один раз в PostContextProvider, при его монтировании;
- Они не пересоздаются каждый ререндер компонента (Postscard, Postslist, и т.д.);
- Следовательно, их ссылка стабильна — а значит, оборачивать их в useCallback в компоненте-потребителе — бессмысленно.

🧠 Когда useCallback нужен
[`Ты используешь useCallback, когда:`]

- функция создаётся в компоненте, и
- ты хочешь передавать её в memoized компонент или зависимость эффекта, и
- хочешь избежать лишней пересозданной функции при каждом рендере.

### Лучше вынести submitEditPosts из контекста в Postlist.jsx, обернуть в useCallback и передать в Postscard как пропс — и вот почему:

✅ Почему это правильное решение:

1. Контекст становится легче и чище
   PostContext сейчас содержит больше, чем нужно, в том числе состояния, которые касаются только отдельных постов (editPostText).

Контекст лучше использовать для глобальных данных и действий, которые нужны многим компонентам, а не для узкой локальной логики редактирования одного поста.

2. Лучше совместимость с React.memo
   Если ты передаёшь submitEditPosts в Postscard, а он создаётся внутри контекста или каждый раз заново, это может ломать мемоизацию.

Оборачивая submitEditPosts в useCallback внутри Postlist.jsx, ты получаешь стабильную по ссылке функцию, которую можно безопасно передавать как пропс в мемо-компонент.

3. Больше контроля и гибкости
   Вынесенная функция submitEditPosts(post_id, newTitle, setEditMode) будет проще, её можно использовать в других местах, не только в карточке.

такая цепочка:

1. submitEditPosts определена в PostContextProvider.
2. Она передаётся как значение в PostContext.
3. Из PostContext ты её получаешь в PostList.jsx.
4. И передаёшь в Postcard.jsx — который мемоизирован: export default memo(Postscard);

✅ Почему useCallback нужен здесь
🔁 Если submitEditPosts не обёрнута в useCallback, то при каждом рендере PostContextProvider создаётся новая ссылка на функцию → это приводит к лишнему ререндеру Postcard.jsx, даже если post не изменился.
React.memo(Postscard) сравнивает старые и новые пропсы по ссылке — и увидит, что submitEditPosts "изменилась", даже если ничего по сути не поменялось.

🔍 Что получаешь:
[`Без useCallback`]:
1. Postcard.jsx перерендеривается лишний раз
2. submitEditPosts всегда новая
3. React.memo бесполезен

[`С useCallback`]:
1. Postcard.jsx ререндерится только по делу
2. submitEditPosts стабильна по ссылке
3. React.memo работает эффективно

[`useCallback обязательно нужен, потому что`]:
- передаёшь функцию вниз через пропсы;
- она используется в мемоизированном дочернем компоненте (Postscard);
- хочешь избежать лишних ререндеров.