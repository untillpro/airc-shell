## TODOs

- [x] Подключить языковые пакеты (`npm i i18next`)
- [x] Сделать переводы для текущих фраз
- [x] Добавить переключалку языков
- [x] Cохранять выбранный язык в localStorage
- [x] Инициализировать язык на старте
- [x] Язык поумолчанию
- [ ] Языкозависимые названия модулей и плагинов (тут как раз и пригодится хранение языка в state)
 - Нужна функция для получения названия модуля\плагина по текущему языку.
- [ ] 404 страница. 
 - Нужно чтобы shell возвращал 404 как-то...
- Подключить нормальную stateMachine, а не это подобие в виде двух стеков состояний. Хранится эта машина будет в state.ui
- Добавить обработку ошибок от API, с соответствующим выводом на экран.
- Добавить API метод - getCurrentLanguage().

## Future tasks
- [ ] Notification mechanism - some kind of push-events. Think about it. 
- [ ] Drawer for notifications.
- [ ] Access rights system. Think about manifest.json format to it
- [ ] Развернутые ошибки в Shell
- [ ] Контроллер перехода по ссылкам. Для чего - чтобы контролировать переходы между окнами с активностью. Например: пользователь зашел на страницу редактирования объекта и поменял свойства (а может и не менял ничего). Потом он нажимает на ссылку в нав. панели и ему должно высветится предупреждение о том, что пользователь собирается покинуть данную страницу (да/нет). При этом эта опция должна быть подключаема. То есть не все переходы должны так контролироваться.

## Errors and bugs

- [ ] Recursive shell page on epsent plugins.
- [x] Auto-login 
- [ ] Переключение между модулями - происходит с "задержкой". Не обвноялется state будто бы
- [ ] Не выводится первая ошибка на экране авторизации. Подозреваю что вообще первая ошибка не выводится. 