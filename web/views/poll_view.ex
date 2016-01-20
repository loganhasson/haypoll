defmodule Haypoll.PollView do
  use Haypoll.Web, :view

  def hidden_buttons(poll) do
    case poll.closed do
      true -> " hidden"
      _    -> ""
    end
  end
end
