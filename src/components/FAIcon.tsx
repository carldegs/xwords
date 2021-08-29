import { Icon } from '@chakra-ui/react';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

const FAIcon: React.FC<FontAwesomeIconProps> = (props) => (
  <Icon>
    <FontAwesomeIcon {...props} />
  </Icon>
);

export default FAIcon;
