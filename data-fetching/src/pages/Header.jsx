import useLatestUserQuery from '../hooks/useLatestUserQuery';

function Header() {
  // const { data: user, isLoading } = useLatestUserQuery(true);
  const { data: user, isLoading } = useLatestUserQuery();

  if (isLoading) {
    return <span>Loading...</span>;
  }
  return (
    <div style={{ position: 'absolute', top: '0px', fontWeight: 'bold' }}>
      <span>
        {user?.id}: {user?.name} from {user?.hometown}
      </span>
    </div>
  );
}

export default Header;
