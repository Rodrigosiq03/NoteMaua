import 'reflect-metadata';
import { Container } from 'inversify';

import { http } from '../http';
import { NotebookRepositoryMock } from '../repositories/notebook_repository_mock';
import { NotebookRepositoryHttp } from '../repositories/notebook_repository_http';
import { GetNotebookUsecase } from '../../../modules/notebook/usecases/get_all_notebooks_usecase';

export const RegistryNotebook = {
  // Axios Adapter
  AxiosAdapter: Symbol.for('AxiosAdapter'),

  // Repositories
  NotebookRepositoryMock: Symbol.for('NotebookRepositoryMock'),
  NotebookRepositoryHttp: Symbol.for('NotebookRepositoryHttp'),

  // Usecases
  GetNotebookUsecase: Symbol.for('GetNotebookUsecase'),
  ValidateNumSerieInJsonUsecase: Symbol.for('ValidateNumSerieInJsonUsecase'),
};

export const containerNotebook = new Container();

// containerUser.bind(RegistryNotebook.UserHttpRepository).toDynamicValue((context) => {
//     return new UserHttpRepository(context.containerUser.get(RegistryNotebook.AxiosAdapter));
// });

containerNotebook
  .bind(RegistryNotebook.NotebookRepositoryMock)
  .to(NotebookRepositoryMock);

containerNotebook
  .bind(RegistryNotebook.NotebookRepositoryHttp)
  .to(NotebookRepositoryHttp);

containerNotebook
  .bind(RegistryNotebook.GetNotebookUsecase)
  .toDynamicValue((context) => {
    if (process.env.NEXT_PUBLIC_STAGE === 'TEST') {
      return new GetNotebookUsecase(
        context.container.get(RegistryNotebook.NotebookRepositoryMock)
      );
    } else if (process.env.NEXT_PUBLIC_STAGE === 'DEV') {
      return new GetNotebookUsecase(
        context.container.get(RegistryNotebook.NotebookRepositoryHttp)
      );
    } else {
      return new GetNotebookUsecase(
        context.container.get(RegistryNotebook.NotebookRepositoryMock)
      );
    }
  });

// containerNotebook
//   .bind(RegistryNotebook.ValidateNumSerieInJsonUsecase)
//   .toDynamicValue((context) => {
//     if (process.env.NEXT_PUBLIC_STAGE === 'TEST') {
//       return new ValidateNumSerieInJsonUsecase(
//         context.container.get(RegistryNotebook.NotebookRepositoryMock)
//       );
//     } else if (process.env.NEXT_PUBLIC_STAGE === 'DEV') {
//       return new ValidateNumSerieInJsonUsecase(
//         context.container.get(RegistryNotebook.NotebookRepositoryHttp)
//       );
//     } else {
//       return new ValidateNumSerieInJsonUsecase(
//         context.container.get(RegistryNotebook.NotebookRepositoryMock)
//       );
//     }
//   });
