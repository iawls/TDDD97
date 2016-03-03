from flask import Flask, jsonify, request
import database_helper
from random import randint

server = Flask(__name__)

@server.route("/signin")
def sign_in():
    print "asdkjhas"
    email = request.values.get('email')
    password = request.values.get('password')

    user = database_helper.get_user_data(email)

    if user == None:
        return jsonify(success = False, message = "Wrong username or password")

    elif user[0][1] == password and len(user) > 0:
        characters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        token = ""
        for i in range(0, 35):
            token += characters[randint(0, len(characters)-1)]
            
        database_helper.login(email, token)
        return jsonify(success = True, message = "Successfully signed in.", data = token)

if __name__ == "__main__":
    server.run()

#@server.route("/post")
#def postMessage():
    
