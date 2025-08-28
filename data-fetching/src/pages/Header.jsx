import useLatestUserQuery from '../hooks/useLatestUserQuery';

function Header() {
  const { data: users, isLoading } = useLatestUserQuery(true);
  // const { data: user, isLoading } = useLatestUserQuery();

  if (isLoading) {
    return <span>Loading...</span>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '0px', fontWeight: 'bold' }}>
      {users?.map(({ id, name, hometown }) => (
        <span>
          {id}: {name} from {hometown}
        </span>
      ))}
      {/* <span>
        {user?.id}: {user?.name} from {user?.hometown}
      </span> */}
    </div>
  );
}

export default Header;
