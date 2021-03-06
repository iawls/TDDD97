from flask import Flask, jsonify, request
import database_helper
from random import randint

server = Flask(__name__)

@server.route("/signin", methods=['POST'])
def sign_in():
    email = request.values.get('email')
    password = request.values.get('password')

    user = database_helper.get_user_data(email)

    if len(user) <= 0:
        return jsonify(success = False, message = "Wrong username or password")

    else:
        if user[0][1] == password:
            characters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
            token = ""
            for i in range(0, 35):
                token += characters[randint(0, len(characters)-1)]
            
            database_helper.login(email, token)
            return jsonify(success = True, message = "Successfully signed in.", data = token)
        else:
            return jsonify(success = False, message = "Wrong username or password.")



@server.route("/signout", methods=['POST'])
def sign_out():
    token=request.values.get('token')
    user = database_helper.get_user_by_token(token)
    if(len(user) == 0):
        return jsonify(success = False, message = "You are not signed in")
    else:
        resp=database_helper.logout(token)
        return jsonify(success = True, message = "Successfully logged out")

@server.route("/signup", methods=['POST'])
def sign_up():
    email=request.values.get('email')
    password=request.values.get('password')
    fname=request.values.get('fname')
    lname=request.values.get('lname')
    gender=request.values.get('gender')
    city=request.values.get('city')
    country=request.values.get('country')

    tmp = database_helper.get_user_data(email)

    if(email == None or password == None or fname == None or lname == None or gender == None or city == None or country == None):
        return jsonify(success = False, message = "Form data missing")
    elif len(tmp) > 0:
        return jsonify(success = False, message = "User already exists")
    else:
        database_helper.add_user(email, password, fname, lname, gender, city, country)
        return jsonify(success = True, message = "Successfully created a new user")

@server.route("/changepassword", methods=['POST'])
def change_password():
    token = request.values.get('token')
    old_pw = request.values.get('old_password')
    new_pw = request.values.get('new_password')
    
    user = database_helper.get_user_by_token(token)
    if len(user) <= 0:
        return jsonify(success = False, message = "You are not logged in")

    userpw = database_helper.get_user_by_email(user[0][0])

    if old_pw == userpw[0][1]:
        database_helper.change_password(user[0][0], new_pw)
        return jsonify(success = True, message = "Password changed")
    else:
        return jsonify(success = False, message = "Wrong password")
    

@server.route("/getuserdatabytoken", methods=['GET'])
def get_user_data_by_token():
    token = request.values.get('token')
    user = database_helper.get_user_by_token(token)
    
    if len(user) > 0:
        userdata = database_helper.get_user_by_email(user[0][0])
        if len(userdata) > 0:
            return jsonify(success = True, message = "Data successfully got", data = [userdata[0][0], userdata[0][2], userdata[0][3], userdata[0][4], userdata[0][5], userdata[0][6]])
        else:
            return jsonify(success = False, message = "Something went terribly wrong, this shouldn't happen")

    else:
        return jsonify(success = False, message = "You're not logged in")

@server.route("/getuserdatabyemail", methods=['GET'])
def get_user_data_by_email():
    email = request.values.get('email')
    token = request.values.get('token')
    userFromToken = database_helper.get_user_by_token(token)
    if len(userFromToken) > 0:
        userdata = database_helper.get_user_by_email(email)
        if len(userdata) > 0:
            print "asd"
            return jsonify(data = [userdata[0][0], userdata[0][2], userdata[0][3], userdata[0][4], userdata[0][5], userdata[0][6]])
        else:
            return jsonify(message = "No such user")
    else:
        return jsonify(message = "You're not signed in")

@server.route("/getusermessagesbytoken", methods=['GET'])
def get_user_messages_by_token():
    token = request.values.get('token')
    user = database_helper.get_user_by_token(token)
    if len(user) > 0:
        messages = database_helper.get_messages(user[0][0])
        if len(messages) > 0:
            return jsonify(success = True, data = messages, message = "Successfully got user data")
        else:
            return jsonify(success = False, message = "User has no messages")
    else:
        return jsonify(success = False,  message = "You're not signed in")


@server.route("/getusermessagesbyemail", methods=['GET'])
def get_user_messages_by_email():
    token = request.values.get('token')
    email = request.values.get('email')
    user = database_helper.get_user_by_token(token)
    if len(user) > 0:
        messages = database_helper.get_messages(email)
        if len(messages) > 0:
            return jsonify(success = True, data = messages, message = "Successfully got user data")
        else:
            return jsonify(success = False, message = "User has no messages")
    else:
        return jsonify(success = False, message = "You're not signed in")

@server.route("/postmessage", methods=['GET'])
def post_message():
    token = request.values.get('token')
    message = request.values.get('message')
    reciever = request.values.get('email')
    sender = database_helper.get_user_by_token(token)
    if(token != None and message != None and reciever != None):
        if len(sender) > 0:
            tmp = database_helper.get_user_by_email(reciever)
            if len(tmp) > 0:
                database_helper.post_message(sender[0][0], reciever, message)
                return jsonify(success = True, message = "Successfully posted message")
            else:
                return jsonify(success = False, message = "No such user")
        else:
            return jsonify(success = False, message = "You're not signed in")
    else:
        return jsonify(success = False, message = "Wrong input data")


if __name__ == "__main__":
    server.run(host='127.0.0.1', port=5001)


#@server.route("/post")
#def postMessage():
    
