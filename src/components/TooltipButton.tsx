import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

import FAIcon from './FAIcon';

interface TooltipButtonProps
  extends Omit<IconButtonProps, 'icon' | 'aria-label'> {
  label: string;
  icon: IconProp;
  'aria-label'?: string;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  label,
  icon,
  ...props
}) => (
  <Tooltip label={label}>
    <IconButton aria-label={label} icon={<FAIcon icon={icon} />} {...props} />
  </Tooltip>
);

export default TooltipButton;
