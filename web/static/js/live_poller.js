import { Socket } from "phoenix"

export class LivePoller {
  constructor() {
    if (!$("#poll-id").length) { return }

    let pollChannel = this._setupPollChannel()
  }
  _createSocket() {
    let socket = new Socket("/socket")

    socket.connect()

    socket.onOpen(() => console.log("Connected"))

    return socket
  }
  _setupPollChannel() {
    let socket = this._createSocket()

    let pollId = $("#poll-id").val()

    let pollChannel = socket.channel("polls:" + pollId)

    pollChannel
      .join()
      .receive("ok", resp => { console.log("Joined") })
      .receive("error", reason => { console.log("Error: ", reason) })

    return pollChannel
  }
}
