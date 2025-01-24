import { Button, ButtonProps } from '@mantine/core';

function EmailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M12 12.713l11.985-8.713H.015z" fill="#4285F4" />
      <path d="M12 13.287L.015 4.574v14.852H23.985V4.574z" fill="#34A853" />
    </svg>
  );
}

export function EmailButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button leftSection={<EmailIcon />} variant="default" {...props} />;
}
