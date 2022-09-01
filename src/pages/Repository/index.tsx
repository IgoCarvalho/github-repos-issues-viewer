import { ChangeEvent, useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaCodeBranch,
  FaRegDotCircle,
  FaSpinner,
  FaStar,
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import {
  Container,
  GoBackButton,
  IssueLabel,
  IssueLabelsList,
  IssuesFilter,
  IssuesFilterOptions,
  IssuesList,
  IssuesListItem,
  Loading,
  LoadMoreIssuesButton,
  RepoActivity,
  RepoHeader,
  RepoInfo,
  UserImageCard,
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

type IssuesFilter = 'all' | 'closed' | 'open';

function Repository() {
  const [reposiroryIssues, setReposiroryIssues] = useState<RepoIssuesData[]>(
    []
  );
  const [reposiroryInfo, setReposiroryInfo] =
    useState<RepositoryInfoData | null>(null);
  const [issuesPage, setIssuesPage] = useState(1);

  const [isLoading, setIsloading] = useState(true);
  const [isLoadingMore, setIsloadingMore] = useState(false);
  const [hasMoreIssuesToLoad, setHasMoreIssuesToLoad] = useState(true);

  const [issueFilter, setIssueFilter] = useState<IssuesFilter>('all');

  const { repoName = '' } = useParams();
  const parsedRepoName = decodeURIComponent(repoName);

  const issuesPerPage = 5;

  useEffect(() => {
    async function getRepositoryData() {
      setIsloading(true);

      try {
        const repoInfoData = await api.get<RepositoryInfoData>(
          `/repos/${parsedRepoName}`
        );

        setReposiroryInfo(repoInfoData.data);
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
              state: issueFilter,
              per_page: issuesPerPage,
              page: issuesPage,
            },
          }
        );

        issuesPage > 1
          ? setReposiroryIssues((issues) => [...issues, ...repoIssues.data])
          : setReposiroryIssues(repoIssues.data);

        setHasMoreIssuesToLoad(repoIssues.data.length >= issuesPerPage);
      } catch (error) {
        console.error(error);
      } finally {
        setIsloadingMore(false);
      }
    }

    loadMoreIssues();
  }, [issueFilter, issuesPage, parsedRepoName]);

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

  function handleFilterSelection(e: ChangeEvent<HTMLInputElement>) {
    const selectedFilter = e.target.value as IssuesFilter;

    setIssueFilter(selectedFilter);

    if (issueFilter !== selectedFilter) {
      setIssuesPage(1);
    }
  }

  function isFilterChecked(value: IssuesFilter) {
    return issueFilter === value;
  }

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

      <IssuesFilter disabled={reposiroryInfo?.open_issues === 0}>
        <legend>Issues</legend>
        <IssuesFilterOptions>
          <input
            id="all-issues"
            type="radio"
            name="issue-filter"
            value="all"
            checked={isFilterChecked('all')}
            onChange={handleFilterSelection}
          />
          <label htmlFor="all-issues">Todas</label>
          <input
            id="opened-issues"
            type="radio"
            name="issue-filter"
            value="open"
            checked={isFilterChecked('open')}
            onChange={handleFilterSelection}
          />
          <label htmlFor="opened-issues">Abertas</label>
          <input
            id="cloded-issues"
            type="radio"
            name="issue-filter"
            value="closed"
            checked={isFilterChecked('closed')}
            onChange={handleFilterSelection}
          />
          <label htmlFor="cloded-issues">Fechadas</label>
        </IssuesFilterOptions>
      </IssuesFilter>

      <IssuesList>
        {reposiroryIssues?.map((issue) => (
          <IssuesListItem key={issue.id}>
            <UserImageCard>
              <img
                src={issue.user.avatar_url}
                alt={`${issue.user.login} avatar`}
                title={issue.user.login}
              />
              <p>{issue.user.login}</p>
            </UserImageCard>

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
