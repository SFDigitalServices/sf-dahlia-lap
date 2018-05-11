# Rails controller for rendering static pages
class PagesController < ApplicationController
  def home
    @page_header = {
      title: 'Welcome to the Leasing Agent Portal.',
      content: 'We hope you enjoy your stay here.'
    }
  end
end
