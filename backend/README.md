#### Бэк энд структура ####

- src
  - auth 
    - guards
    - strategy
  - chat
  - chatOnline
  - core 
    - enviroment
  - hotel
  - hotel-room
  - reservation
  - users

### Назначение модулей ###

## Модуль auth ##
**Общее описание** - данный модуль отвечает за политику разделения прав доступа по 3 типам пользователей *клиент*, *менеджер*, *администратор*, а так же за логирование и разлогирование пользователя.<br>

**Стратегии** - src\auth\strategy содержит стратегии для разрешения доступа согласно правам клиент, менеджер админ. Все стратегии работают идентично - получаем токен из куки файла, ищем пользователя по id в базе и определяем его role. Если role подходит то выполнение запроса будет продолжено. <br>

**Сервисы :** <br>
**validateUser** (email: string, password: string) - передает данные в *usersService.checkUser* и проводит проверку на корректность введеных данных.<br>
**login** ({user}) - принимает объект, на основе полей id, role, name формирует объект и зашифровыывет его в токен. Возвращает токен.<br>
**logout** - очищает токен в куки файле и возвращает на стартовую страницу <br>

**Роуты :**<br>
**api/auth/login** - залогиниться<br>
**api/auth/logout** - разлогиниться<br>

## Модуль Chat ##
**Общее описание** - данный модуль реализует возможность написания обращений в тех поддержку и работу с ними. <br>
### Сервисы : ###
**supportRequest.Service** - это сервис для функционирования личного кабинета менеджера при работе с обращениями <br>
*getSupportRequests(user?: string, isActive: boolean)* - функция принимает id пользователя (не обязательный параметр) и isActive, далее происходит поиск обращений от конкрентого пользователя или от всех. Флаг isActive говорит о том что закрыто обращение (false) или открыто (true)<br>

*sendMessage({author: string, role : string, name : string, text: string}, id)* - это функция для написания нового сообщения в существующее обращение, используется как для client так и для manager.<br>

*getMessages(id: string)* - функция принимает id обращения и выводит все сообщения содержащиеся в нем, используется как для client так и для manager.<br>

**supportRequestClient.service** - это сервис для функционирования личного кабинета client при работе с обращениями в тех. поддержку.<br>

*createSupportRequest({title: string, text: string}, access_token: string)* - функция для создания нового обращения в тех. поддержку от клиента. Принимает заголовок обращения и текст, который становится первым объектом в массиве messages.<br>

*findSupportRequestsClient(accsess_token: string)* - функция для поиска и вывода всех обращений пользователя. Принимает токен, далее декодирует его и получает id пользователя, по которому происходит поиск в базе обращений.<br>

*markMessagesAsRead(id: string)* - функция принимает id обращения и отмечает все сообщения от тех. поддержки в нем как прочитанные, путем изменения значения поля readAt.<br>

*getUnreadCount(id: sring)* - функция принимает id обращения и выводит количество всех непрочитанных сообщений от тех. поддержкисообщений (readAt === null).<br>

**supportRequestEmployee.service** - этот сервис содержит вспомогательные функции для работы чата тех.поддержки

*markMessagesAsRead(id: string)* - функция принимает id обращения и отмечает все сообщения от клиента в нем как прочитанные, путем изменения значения поля readAt.<br>

*getUnreadCount(id: string)* - функция принимает id обращения и выводит количество всех непрочитанных сообщений от клиента (readAt === null).<br>

*closeRequest(id: string)* - функция принимает id обращения, находит его в базе и закрывает путем изменения значения поля isActive === false.<br>


## Модуль Chat ##
**Общее описание** - данный модуль реализует возможность онлайн чата пользователя с тех. поддержкой. Работа реализована через технологию sokket без использования комнат. Перед сообщением пишется имя отправителя. <br>


## Модуль Hotel ##
**Общее описание** - данный модуль реализует возможность работы с отелями, а именно создание нового отеля, поиск всех отелей, поиск отеля по id, реадактирование отеля. <br>
**Доступ: только для администатора!** <br>

**Роуты :** <br>
*@POST api\admin\holels* - создание нового отеля <br>
*@GET api\admin\holels* - список всех отелей <br>
*@GET api\admin\holels:id* - поиск отеля по id <br>
*@GET api\admin\holels-edit:id* - поиск отеля по id и редактирование <br>

**hotel.service :** <br>
*create({title: string, description: string, text: string})* - функция создания нового отеля, принимает название (title), описание (description), текст (text) <br>

*findAll({limit, offset, title}) - функция для отображения отелей, принимает query параметры (не обязательные) <br>

*update(id: string, {title: string, description: string, text: string})* - функция для обновления данных отеля. Принимает id отеля и данные для обновления.<br>

## Модуль Hotel-room ##
**Общее описание** - данный модуль реализует возможность работы с комнатами, а именно создание новой комнаты, поиск всех комнат, поиск комнаты по id, реадактирование комнаты. <br>
**Доступ: только для администатора!** <br>

**Роуты :** <br>
*@POST api\admin\holel-room* - создание новой комнаты <br>
*@GET api\admin\holel-rooms* - список всех комнат <br>
*@GET api\admin\holel-rooms:id* - поиск комнаты по id <br>
*@GET api\admin\holels-rooms-edit:id* - поиск комнаты по id и редактирование <br>

**hotel-room.service :** <br>
*create({description: string, images: string[], isEnable: boolean, hotel: string })* - это функция создания новой комнаты, которая принимает объект состоящий из описания (descriprion) , массива с сылками на картинки (images), статус доступности комнаты (isEnable), id отеля к которому комната принадлежит (hotel). <br>

*findAll(query: {limit: number, offset: number, hotel: Types.ObjectId, isEnabled?: boolean})* - это функция для отображения всех комнат, принимает необязательные query параметры.<br>

*findById(id: string)* - функция поиска комнаты по id.<br>

*updateById(id: string, {description: string, images: string[]}, files)*  - это функция для поиска и обновления комнаты. Принимает id комнаты, объект с обновленными данными, массив ссылок на картинки. <br>

## Модуль Reservation ##
**Общее описание** - данный модуль реализует возможность работы с резервированием комнат как для клиентов так и для менеджеров. <br>

**Роуты :** <br>
**reservation.client.controller** - данные роуты доступны только для пользователей с ролью client.<br>
*@POST api\client\reservations* - создание нового бронирования <br>
*@GET api\client\reservations* - список всех бронирований <br>
*@DELETE api\client\reservations:id* - удаление бронирования по id <br>

**reservation.manager.controller** - данные роуты доступны только для пользователей с ролью manager.<br>
*@GET api\manager\reservations\:id* - поиск бронирований по id клиента <br>
*@DELETE api\manager\reservations\:id* - удаление бронирования по id <br>

**Cервисы**<br>
**reservation.service**<br>
*create({hotelRoom: string, dataStart: Date, dataEnd: Date}, access_token)* - это функция для создания нового бронирования клиентом, принимает объект с данными для бронирования (id комнаты, дата начала бронирования, дата окончания бронирования), а так же токен пользователя. Токен нужен для извлечения id пользователя.<br>

*allReservationsClient(access_token: string)* - это функция для отображения под клиентом всех бронирований данного клиента, принимает токен пользователя.<br>

*allReservationsManager(userId: string)* - это функция для отображения под менеджером всех бронированний конкрентого пользователя, принимает id пользователя.<br>

*removeReservationClient( access_token: string, idReservation: string)* - это функция для удаления из под клиента бронирования, принимает токен и id бронирования.<br>

*removeReservationManager(idReservation: string)* - это функция для удаления из под менеджера бронирования клиента, принимает id бронирования.<br>



## Модуль Users ##
**Общее описание** - данный модуль реализует возможность работы некоторых функция для client, manager, admin <br>

**Роуты :** <br>
**client.controller**
*@POST api\client\register* - создание нового пользователя (автомтически с ролью client) <br>
*@GET api\client\rooms* - выводит список всех комнат <br>
*@GET api\client\find-room* - выводит список всех комнат, которые свободны на выбранные даты <br>
*@POST api\client\support-requests* - создание нового обращения в тех. поддержку<br>
*@GET api\client\support-requests* - список всех обращений в тех. поддержку для текущего клиента<br>
*@GET api\client\support-requests-messages-read\:id* - проставляет маркер о прочтении в сообщения от тех. поддержки<br>

**manager.controller** - данные роуты доступны только с ролью manager!
*@GET api\manager\users* - отображает всех зарегестрированных пользователей <br>

**users.controller** - данные роуты доступны только с ролью admin!
*@POST api\admin\users* - создание нового пользователя, администратор может прописать ему любые права. <br>
*@GET api\admin\users* - отображает всех зарегестрированных пользователей. <br>
*@GET api\admin\users\:id* - находит пользователя по id <br>
*@GET api\admin\users\email\:email* - находит пользователя по email <br>
*@DELETE api\admin\users\:id* - найти пользователя по id и удалить <br>


**Cервисы**<br>
**client.service** <br>
*create({email: string, name: string, password: string, contactPhone: string})* - данная функция создает нового пользователя при регистрации, сразу с ролью client. На вход принимает объект с регистрационными данными. <br>

*allRooms* - данная функция выводит список из всех комнат. <br>

*findRoomsOnData({dateStart: Date, dataEnd: Date})* - эта функция выводит список свободных комнат на указанную дату, на вход принимает объект из даты начала и даты окончания бронирования. <br>

*findRoomById(id: string)* - эта функция находит комнату по id. <br>

**manager.service** <br>
*findAll()* - эта функция выводит список всех пользователей


**users.service** <br>
*create(({email: string, name: string, password: string, contactPhone: string, role: string}))* - это функция для создания нового пользователя админист ратором. Администратор может выбрать роль для нового пользователя (client, manager, admin).<br>

*findById(id: string)* - эта функция для поиска пользователя по id <br>

*findByEmail(email: string)* - эта функция для поиска пользователя по email <br>

*findAll({ limit, offset, email, name, contactPhone })* - это функция для поиска всех пользователей, принимает необязательные query параметры.<br>

*removeUser(id: string)* - это функция для поиска пользователя по id и удалению.

