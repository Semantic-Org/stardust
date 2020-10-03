import PropTypes from 'prop-types'

const versions = PropTypes.shape({
  anchor: PropTypes.string.isRequired,
  babel: PropTypes.shape({
    standalone: PropTypes.string.isRequired,
  }).isRequired,
  faker: PropTypes.string.isRequired,
  fui: PropTypes.string.isRequired,
  propTypes: PropTypes.string.isRequired,
  react: PropTypes.string.isRequired,
  suir: PropTypes.string.isRequired,
})

export default versions
