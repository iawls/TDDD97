import sqlite3 as lite
from flask import Flask, g

dbhelper = Flask(__name__)


def connect_db():
    return lite.connect("database.db")

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

def init_db():
    with dbhelper.app_context():
        db = get_db()
        with dbhelper.open_resource('database.schema', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit();

def add_message(name, message):
    c.get_db()
    c.execute("insert into entries (name,message) values (?,?)", (name,message))
    c.commit()

def close():
    get_db().close()

def get_message(name):
    c = get_db()
    cursor = c.cursor()
    cursor.execute("select name, message from entries where name = '" + name + "'")
    entries = [dict(name=row[0], message=row[1]) for row in cursor.fetchall()]
    c.close()
    return entries[0]['name'] + " says: " + entries[0]['message']

def query_db(query, args=(), one=False):
    with dbhelper.app_context():
        c = get_db().execute(query, args)
        get_db().commit()
        response = c.fetchall()
        c.close()
        return (response[0] if response else None) if one else response

def add_user(email, password, fname, lname, gender, city, country):
    resp = query_db("INSERT INTO users VALUES (?,?,?,?,?,?,?)", [email, password, fname, lname, gender, city, country])
    return resp

def get_user_by_email(email):
    resp = query_db("SELECT * FROM users WHERE email=?", [email])
    return resp

def get_user_by_token(token):
    resp = query_db("SELECT email FROM loggedInUsers WHERE token=?", [token])
    return resp

def login(email, token):
    resp = query_db("INSERT INTO loggedInUsers VALUES (?,?)", [email, token])
    return resp

def logout(token):
    resp = query_db("DELETE FROM loggedInUsers WHERE token=?", [token])
    return resp;

def change_password(email, password):
    resp = query_db("UPDATE users SET password=? WHERE email=?", [password, email])
    return resp;

def post_message(sender, reciever, message):
    resp = query_db("INSERT INTO messages VALUES (?,?,?)", [sender, reciever, message])
    return resp

def get_messages(user):
    resp = query_db("SELECT * FROM messages WHERE reciever=?", [user])
    return resp

def get_user_data(user):
    resp = query_db("SELECT * FROM users WHERE email=?", [user])
    return resp



