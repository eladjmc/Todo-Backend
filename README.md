<div dir="rtl">

# דוקומנטציה ל-API של השרת

המסמך הזה מתאר את ה-API של השרת שלנו, כולל כל הראוטים, הפרמטרים והתגובות. ה-API מאפשר למשתמשים להירשם, להתחבר ולנהל רשימות Todo אישיות.

## תוכן העניינים

1. [משתמשים (Users)](#משתמשים-users)
   - [הרשמת משתמש](#הרשמת-משתמש-post-apiv1usersregister)
   - [התחברות משתמש](#התחברות-משתמש-post-apiv1userslogin)
   - [מידע על המשתמש הנוכחי](#מידע-על-המשתמש-הנוכחי-get-apiv1userscurrent)
   - [מחיקת משתמש](#מחיקת-משתמש-delete-apiv1usersdelete-user)
2. [משימות (Todos)](#משימות-todos)
   - [קבלת כל המשימות](#קבלת-כל-המשימות-get-apiv1todos)
   - [יצירת משימה חדשה](#יצירת-משימה-חדשה-post-apiv1todos)
   - [עדכון משימה קיימת](#עדכון-משימה-קיימת-put-apiv1todosid)
   - [מחיקת משימה](#מחיקת-משימה-delete-apiv1todosid)

## משתמשים (Users)

### הרשמת משתמש (POST /api/v1/users/register)

- **תיאור:** מאפשר למשתמש חדש להירשם למערכת.
- **כתובת:** `/api/v1/users/register`
- **שיטה:** POST
- **גוף הבקשה (JSON):**

<div dir="ltr">

```json
{
  "name": "שם מלא",
  "age": גיל,
  "email": "example@example.com",
  "password": "סיסמה123"
}
```

</div>

- **שדות חובה:**
  - `name` (מחרוזת)
  - `email` (מחרוזת)
  - `password` (מחרוזת, לפחות 6 תווים)

- **תגובה מוצלחת (201 Created):**

<div dir="ltr">

```json
{
  "_id": "מזהה_משתמש",
  "email": "example@example.com",
  "name": "שם מלא",
  "accessToken": "JWT_טוקן"
}
```

</div>

- **שגיאות אפשריות:**
  - 400 Bad Request: שדות חסרים או לא תקינים.
  - 400 Bad Request: המשתמש כבר קיים.

---

### התחברות משתמש (POST /api/v1/users/login)

- **תיאור:** מאפשר למשתמש קיים להתחבר למערכת.
- **כתובת:** `/api/v1/users/login`
- **שיטה:** POST
- **גוף הבקשה (JSON):**

<div dir="ltr">

```json
{
  "email": "example@example.com",
  "password": "סיסמה123"
}
```

</div>

- **שדות חובה:**
  - `email` (מחרוזת)
  - `password` (מחרוזת)

- **תגובה מוצלחת (200 OK):**

<div dir="ltr">

```json
{
  "_id": "מזהה_משתמש",
  "email": "example@example.com",
  "name": "שם מלא",
  "accessToken": "JWT_טוקן"
}
```

</div>

- **שגיאות אפשריות:**
  - 400 Bad Request: שדות חסרים.
  - 401 Unauthorized: אישורים שגויים.

---

### מידע על המשתמש הנוכחי (GET /api/v1/users/current)

- **תיאור:** מקבל מידע על המשתמש המחובר כרגע.
- **כתובת:** `/api/v1/users/current`
- **שיטה:** GET
- **כותרות (Headers):**
  - `Authorization: Bearer <accessToken>`

- **תגובה מוצלחת (200 OK):**

<div dir="ltr">

```json
{
  "_id": "מזהה_משתמש",
  "name": "שם מלא",
  "age": גיל,
  "email": "example@example.com",
  "Todos": [
    {
      "_id": "מזהה_משימה",
      "title": "כותרת המשימה",
      "description": "תיאור המשימה",
      "completed": false,
      "owner": "מזהה_משתמש",
      "createdAt": "תאריך יצירה",
      "updatedAt": "תאריך עדכון"
    },
    ...
  ],
  "createdAt": "תאריך יצירה",
  "updatedAt": "תאריך עדכון"
}
```

</div>

- **שגיאות אפשריות:**
  - 401 Unauthorized: טוקן חסר או לא תקף.

---

### מחיקת משתמש (DELETE /api/v1/users/delete-user)

- **תיאור:** מוחק את המשתמש המחובר ואת כל המשימות הקשורות אליו.
- **כתובת:** `/api/v1/users/delete-user`
- **שיטה:** DELETE
- **כותרות (Headers):**
  - `Authorization: Bearer <accessToken>`

- **תגובה מוצלחת (200 OK):**

<div dir="ltr">

```json
{
  "success": true,
  "data": "User and associated todos deleted successfully"
}
```

</div>

- **שגיאות אפשריות:**
  - 401 Unauthorized: טוקן חסר או לא תקף.

---

## משימות (Todos)

### קבלת כל המשימות (GET /api/v1/todos)

- **תיאור:** מקבל את כל המשימות של המשתמש המחובר.
- **כתובת:** `/api/v1/todos`
- **שיטה:** GET
- **כותרות (Headers):**
  - `Authorization: Bearer <accessToken>`

- **תגובה מוצלחת (200 OK):**

<div dir="ltr">

```json
[
  {
    "_id": "מזהה_משימה",
    "title": "כותרת המשימה",
    "description": "תיאור המשימה",
    "completed": false,
    "owner": "מזהה_משתמש",
    "createdAt": "תאריך יצירה",
    "updatedAt": "תאריך עדכון"
  },
  ...
]
```

</div>

- **שגיאות אפשריות:**
  - 401 Unauthorized: טוקן חסר או לא תקף.

---

### יצירת משימה חדשה (POST /api/v1/todos)

- **תיאור:** יוצר משימה חדשה עבור המשתמש המחובר.
- **כתובת:** `/api/v1/todos`
- **שיטה:** POST
- **כותרות (Headers):**
  - `Authorization: Bearer <accessToken>`
- **גוף הבקשה (JSON):**

<div dir="ltr">

```json
{
  "title": "כותרת המשימה",
  "description": "תיאור המשימה" // אופציונלי
}
```

</div>

- **שדות חובה:**
  - `title` (מחרוזת)

- **תגובה מוצלחת (201 Created):**

<div dir="ltr">

```json
{
  "_id": "מזהה_משימה",
  "title": "כותרת המשימה",
  "description": "תיאור המשימה",
  "completed": false,
  "owner": "מזהה_משתמש",
  "createdAt": "תאריך יצירה",
  "updatedAt": "תאריך עדכון"
}
```

</div>

- **שגיאות אפשריות:**
  - 400 Bad Request: שדות חסרים.
  - 401 Unauthorized: טוקן חסר או לא תקף.

---

### עדכון משימה קיימת (PUT /api/v1/todos/:id)

- **תיאור:** מעדכן משימה קיימת של המשתמש המחובר.
- **כתובת:** `/api/v1/todos/:id`
- **שיטה:** PUT
- **כותרות (Headers):**
  - `Authorization: Bearer <accessToken>`
- **פרמטרים:**
  - `:id` - מזהה המשימה (ObjectId)
- **גוף הבקשה (JSON):**

<div dir="ltr">

```json
{
  "title": "כותרת מעודכנת",         // אופציונלי
  "description": "תיאור מעודכן",   // אופציונלי
  "completed": true                // אופציונלי
}
```

</div>

- **תגובה מוצלחת (200 OK):**

<div dir="ltr">

```json
{
  "_id": "מזהה_משימה",
  "title": "כותרת מעודכנת",
  "description": "תיאור מעודכן",
  "completed": true,
  "owner": "מזהה_משתמש",
  "createdAt": "תאריך יצירה",
  "updatedAt": "תאריך עדכון"
}
```

</div>

- **שגיאות אפשריות:**
  - 400 Bad Request: מזהה משימה לא תקין.
  - 401 Unauthorized: טוקן חסר או לא תקף, או שהמשתמש אינו הבעלים של המשימה.
  - 404 Not Found: משימה לא נמצאה.

---

### מחיקת משימה (DELETE /api/v1/todos/:id)

- **תיאור:** מוחק משימה קיימת של המשתמש המחובר.
- **כתובת:** `/api/v1/todos/:id`
- **שיטה:** DELETE
- **כותרות (Headers):**
  - `Authorization: Bearer <accessToken>`
- **פרמטרים:**
  - `:id` - מזהה המשימה (ObjectId)

- **תגובה מוצלחת (200 OK):**

<div dir="ltr">

```json
{
  "message": "Todo deleted"
}
```

</div>

- **שגיאות אפשריות:**
  - 400 Bad Request: מזהה משימה לא תקין.
  - 401 Unauthorized: טוקן חסר או לא תקף, או שהמשתמש אינו הבעלים של המשימה.
  - 404 Not Found: משימה לא נמצאה.

---

</div>