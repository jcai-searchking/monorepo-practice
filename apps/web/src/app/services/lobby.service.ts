import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Lobby,
  LobbyDetailResponse,
  LobbyListResponse,
} from '../models/lobby';

@Injectable({ providedIn: 'root' })
export class LobbyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/lobbies`;

  /** GET /lobbies — active lobbies (endTime in the future), soonest first. */
  listLobbies(): Observable<Lobby[]> {
    return this.http
      .get<LobbyListResponse>(this.baseUrl)
      .pipe(map((res) => res.lobbies));
  }

  /** GET /lobbies/:id — full detail for a single lobby. */
  getLobby(id: string): Observable<Lobby> {
    return this.http
      .get<LobbyDetailResponse>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.lobby));
  }
}
