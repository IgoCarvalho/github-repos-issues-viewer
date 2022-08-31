import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';

import {
  Container,
  Form,
  RemoveRepoButton,
  ReposList,
  ReposListHeader,
  ReposListItem,
  SubmitButton,
} from './styles';

import { Link } from 'react-router-dom';
import api from '../../services/api';

type RepoProps = {
  name: string;
};

function Home() {
  const [searchRepo, setSearchRepo] = useState('');
  const [repositories, setRepositories] =
    useState<RepoProps[]>(getStoragedRepos);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('@app_repos', JSON.stringify(repositories));
  }, [repositories]);

  function getStoragedRepos() {
    const storagedRepos = localStorage.getItem('@app_repos') ?? '[]';

    return JSON.parse(storagedRepos);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchRepo(e.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (searchRepo.trim() === '') {
        throw new Error('Você precisa indicar um repositório!');
      }

      const repoAlreadyExists = repositories.find(
        (repo) => repo.name === searchRepo
      );

      if (repoAlreadyExists) {
        throw new Error('Repositório duplicado!');
      }

      const response = await api.get(`repos/${searchRepo}`);

      const data: RepoProps = {
        name: response.data.full_name,
      };

      setRepositories((repos) => [...repos, data]);
      setSearchRepo('');
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDeleteRepoAction(repoName: string) {
    return () => {
      setRepositories((repos) =>
        repos.filter((repo) => repo.name !== repoName)
      );
    };
  }

  return (
    <Container>
      <h1>
        <FaGithub />
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit} spellCheck={false}>
        <input
          type="text"
          placeholder="Adicionar Repositorio"
          onChange={handleInputChange}
          value={searchRepo}
        />

        <SubmitButton type="submit" isLoading={isLoading} disabled={isLoading}>
          {isLoading ? (
            <FaSpinner color="#FFF" size={15} />
          ) : (
            <FaPlus color="#FFF" size={15} />
          )}
        </SubmitButton>
      </Form>

      <ReposList>
        <ReposListHeader>
          <p>Repositórios: {repositories.length}</p>
        </ReposListHeader>

        {repositories.map((repo) => (
          <ReposListItem key={repo.name}>
            <Link to={`repositorio/${encodeURIComponent(repo.name)}`}>
              {repo.name}
            </Link>
            <RemoveRepoButton onClick={handleDeleteRepoAction(repo.name)}>
              <FaTrash />
            </RemoveRepoButton>
          </ReposListItem>
        ))}
      </ReposList>
    </Container>
  );
}

export default Home;
