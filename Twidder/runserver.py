from gevent.wsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from Twidder import app

app.run(debug=True)
http_server = WSGIServer(('', 5000), app)
http_server.serve_forever()

