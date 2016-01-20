import { Socket } from "phoenix"

export class LivePoller {
  constructor() {
    if (!$("#poll-id").length) { return }

    let pollChannel = this._setupPollChannel()

    this._setupVoteButtons(pollChannel)
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

    pollChannel.on("new_vote", vote => {
      this._updateDisplay(vote.entry_id)
    })

    pollChannel
      .join()
      .receive("ok", resp => { console.log("Joined") })
      .receive("error", reason => { console.log("Error: ", reason) })

    return pollChannel
  }
  _updateDisplay(entryId) {
    let self = this

    $.each($("li.entry"), (index, item) => {
      let li = $(item)

      if (entryId == li.data("entry-id")) {
        let newVotes = +(li.find(".votes").text()) + 1

        self._updateEntry(li, newVotes)
      }
    })
  }
  _updateEntry(li, newVotes) {
    li.find(".votes").text(newVotes)
  }
  _setupVoteButtons(pollChannel) {
    $(".vote").on("click", event => {
      event.preventDefault()

      let li = $(event.currentTarget).parents("li")

      let entryId = li.data("entry-id")

      let pollId = $("#poll-id").val()

      pollChannel.push("new_vote", { entry_id: entryId })
    })
  }
}
