import { Socket } from "phoenix"

export class LivePoller {
  constructor() {
    if (!$("#poll-id").length) { return }

    let pollChannel = this._setupPollChannel()

    this._setupVoteButtons(pollChannel)
    this._setupGraph()
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
      this._updateGraph()
    })

    pollChannel
      .join()
      .receive("ok", resp => { console.log("Joined") })
      .receive("error", reason => { console.log("Error: ", reason) })

    return pollChannel
  }
  _updateDisplay(entryId) {
    $.each($("li.entry"), (index, item) => {
      let li = $(item)

      if (entryId == li.data("entry-id")) {
        let newVotes = +(li.find(".votes").text()) + 1

        this._updateEntry(li, newVotes)
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
  _setupGraph() {
    google.load("visualization", "1", { packages: ["corechart"] })
    google.setOnLoadCallback(() => {
      this.chart = new google.visualization.PieChart(document.getElementById("my-chart"))
      this._updateGraph()
    })
  }
  _updateGraph() {
    let data = this._getGraphData()
    let convertedData = google.visualization.arrayToDataTable(data)

    this.chart.draw(convertedData, { title: "Poll", is3D: true })
  }
  _getGraphData() {
    var data = [["Choice", "Votes"]]

    $.each($("li.entry"), (index, item) => {
      let li = $(item)
      let title = li.find(".title").text()
      let votes = +(li.find(".votes").text())

      data.push([title, votes])
    })

    return data
  }
}
