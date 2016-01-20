defmodule Haypoll.PollChannel do
  use Phoenix.Channel

  def join("polls:" <> poll_id, _params, socket) do
    {:ok, socket}
  end
end
