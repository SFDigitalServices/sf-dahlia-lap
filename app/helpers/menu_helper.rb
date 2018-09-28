# Helper for menu object
module MenuHelper
  def menu_link(title, url)
    link_to title, url, class: "#{active_path(url)} #{title.parameterize}"
  end
end
