# We could have a model for this, but right now I just one to get it to work
class ShortFormValidator
  attr_reader :errros
  def initialize(attributes)
    @attributes = attributes
    @errors = ActiveModel::Errors.new(self)
  end

  def valid?
    _validate_presence_of :listingID
    @errors.empty?
  end

  def _validate_presence_of(id)
    @errors.add(id, 'must be present') unless @attributes[id].present?
  end
end
