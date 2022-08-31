import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaStar,
  FaCodeBranch,
  FaRegDotCircle,
  FaSpinner,
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import {
  Container,
  GoBackButton,
  IssueLabel,
  IssueLabelsList,
  IssuesList,
  IssuesListItem,
  Loading,
  LoadMoreIssuesButton,
  RepoActivity,
  RepoHeader,
  RepoInfo,
} from './styles';

type GitHubUser = {
  login: string;
  avatar_url: string;
  url: string;
};

type RepositoryInfoData = {
  owner: GitHubUser;
  name: string;
  description?: string;
  open_issues: number;
  forks: number;
  created_at: string;
  full_name: string;
  stargazers_count: number;
};

type RepoIssueLabel = {
  id: number;
  name: string;
  color: string;
};

type RepoIssuesData = {
  id: number;
  user: GitHubUser;
  title: string;
  html_url: string;
  labels: RepoIssueLabel[];
  created_at: string;
};

function Repository() {
  const [reposiroryIssues, setReposiroryIssues] = useState<
    RepoIssuesData[] | null
  >(null);
  const [reposiroryInfo, setReposiroryInfo] =
    useState<RepositoryInfoData | null>(null);
  const [issuesPage, setIssuesPage] = useState(1);

  const [isLoading, setIsloading] = useState(true);
  const [isLoadingMore, setIsloadingMore] = useState(false);
  const [hasMoreIssuesToLoad, setHasMoreIssuesToLoad] = useState(true);

  const { repoName = '' } = useParams();
  const parsedRepoName = decodeURIComponent(repoName);

  const issuesPerPage = 5;

  useEffect(() => {
    async function getRepositoryData() {
      setIsloading(true);

      try {
        const [repoInfoData, repoIssuesData] = await Promise.all([
          api.get<RepositoryInfoData>(`/repos/${parsedRepoName}`),
          api.get<RepoIssuesData[]>(`/repos/${parsedRepoName}/issues`, {
            params: {
              state: 'open',
              per_page: issuesPerPage,
            },
          }),
        ]);

        setReposiroryInfo(repoInfoData.data);
        setReposiroryIssues(repoIssuesData.data);
        setHasMoreIssuesToLoad(repoIssuesData.data.length >= issuesPerPage);
      } catch (error) {
        console.error(error);
      } finally {
        setIsloading(false);
      }
    }

    getRepositoryData();
  }, [parsedRepoName]);

  useEffect(() => {
    async function loadMoreIssues() {
      setIsloadingMore(true);
      try {
        const repoIssues = await api.get<RepoIssuesData[]>(
          `/repos/${parsedRepoName}/issues`,
          {
            params: {
              state: 'open',
              per_page: issuesPerPage,
              page: issuesPage,
            },
          }
        );

        setReposiroryIssues((issues) => {
          if (issues) {
            return [...issues, ...repoIssues.data];
          }

          return [...repoIssues.data];
        });
        setHasMoreIssuesToLoad(repoIssues.data.length >= issuesPerPage);
      } catch (error) {
        console.error(error);
      } finally {
        setIsloadingMore(false);
      }
    }

    // skip first render
    issuesPage > 1 && loadMoreIssues();
  }, [issuesPage, parsedRepoName]);

  function formatNumber(value = 0) {
    const numberFormater = Intl.NumberFormat('pt-br');

    return numberFormater.format(value);
  }

  function formatDate(
    date = new Date().toString(),
    format: 'short' | 'long' = 'short'
  ) {
    const dateFormats = {
      short: {
        dateStyle: 'short',
        timeStyle: 'medium',
      } as Intl.DateTimeFormatOptions,
      long: {
        dateStyle: 'long',
      } as Intl.DateTimeFormatOptions,
    };

    const dateFormater = Intl.DateTimeFormat('pt-br', dateFormats[format]);

    return dateFormater.format(new Date(date));
  }

  function nextIssuesPage() {
    setIssuesPage(issuesPage + 1);
  }

  console.log('render');

  if (isLoading) {
    return <Loading>Carregando...</Loading>;
  }

  return (
    <Container>
      <RepoHeader>
        <nav>
          <GoBackButton to="/">
            <FaArrowLeft /> Voltar
          </GoBackButton>
        </nav>

        <RepoInfo>
          <img
            src={reposiroryInfo?.owner.avatar_url}
            alt={`${reposiroryInfo?.owner.login} github avatar`}
            title={reposiroryInfo?.owner.login}
          />

          <div>
            <h1>{reposiroryInfo?.name}</h1>
            <p>
              <strong>Proprietario:</strong> {reposiroryInfo?.owner.login}
            </p>
            <p>
              <strong>Criado:</strong>{' '}
              {formatDate(reposiroryInfo?.created_at, 'long')}
            </p>
            {reposiroryInfo?.description && (
              <p>
                <strong>Descrição:</strong> {reposiroryInfo?.description}
              </p>
            )}

            <RepoActivity>
              <p title="Stars">
                <FaStar /> {formatNumber(reposiroryInfo?.stargazers_count)}
              </p>
              <p title="Forks">
                <FaCodeBranch /> {formatNumber(reposiroryInfo?.forks)}
              </p>
              <p title="Issues">
                <FaRegDotCircle /> {formatNumber(reposiroryInfo?.open_issues)}
              </p>
            </RepoActivity>
          </div>
        </RepoInfo>
      </RepoHeader>

      <IssuesList>
        {reposiroryIssues?.map((issue) => (
          <IssuesListItem key={issue.id}>
            <img
              src={issue.user.avatar_url}
              alt={`${issue.user.login} avatar`}
            />

            <div>
              <a href={issue.html_url} target="_blank" rel="noreferrer">
                {issue.title}
              </a>
              <span>{formatDate(issue.created_at)}</span>

              <IssueLabelsList>
                {issue.labels.map((label) => (
                  <IssueLabel key={label.id} color={label.color}>
                    {label.name}
                  </IssueLabel>
                ))}
              </IssueLabelsList>
            </div>
          </IssuesListItem>
        ))}
      </IssuesList>

      {hasMoreIssuesToLoad && (
        <LoadMoreIssuesButton disabled={isLoadingMore} onClick={nextIssuesPage}>
          {isLoadingMore && <FaSpinner />}
          Carregar mais issues
        </LoadMoreIssuesButton>
      )}
    </Container>
  );
}

export default Repository;
