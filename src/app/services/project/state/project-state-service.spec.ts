// project-state.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { ProjectStateService } from './project-state-service';
import { UtilsService } from '../../utils-service';

import {
  HzxProject,
  HzxGpx,
  HzxTrack,
  HzxRoute,
  HzxWaypoint,
} from '../model/hzxProject';

describe('ProjectStateService', () => {
  let service: ProjectStateService;

  const utilsServiceMock = {
    getRandomColor: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    utilsServiceMock.getRandomColor.mockReturnValue('#ff0000');

    TestBed.configureTestingModule({
      providers: [
        ProjectStateService,
        {
          provide: UtilsService,
          useValue: utilsServiceMock,
        },
      ],
    });

    service = TestBed.inject(ProjectStateService);
  });

  /* -------------------------------------------------------------------------- */
  /*                                    HELPERS                                 */
  /* -------------------------------------------------------------------------- */

  function createTrack(id: string, name = 'track'): HzxTrack {
    return {
      metadata: {
        id,
        name,
        color: '#000000',
      },
      track: {} as any,
    };
  }

  function createRoute(id: string, name = 'route'): HzxRoute {
    return {
      metadata: {
        id,
        name,
        color: '#000000',
      },
      rout: {} as any,
    };
  }

  function createWaypoint(id: string, name = 'waypoint'): HzxWaypoint {
    return {
      metadata: {
        id,
        name,
        color: '#000000',
      },
      waypoint: {} as any,
    };
  }

  function createFile(id: string, name = 'file'): HzxGpx {
    return {
      metadata: {
        id,
        name,
        color: '#123456',
      },
      meta: {} as any,
      raw: {} as any,
      tracks: [],
      routes: [],
      waypoints: [],
    };
  }

  function createProject(): HzxProject {
    return {
      metadata: {
        id: 'project-1',
        name: 'Test Project',
        color: '#ffffff',
      },
      files: [],
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default project', () => {
    const project = service.project();

    expect(project.metadata.name).toBe('new project');
    expect(project.metadata.color).toBe('#ff0000');
    expect(project.files).toEqual([]);
    expect(utilsServiceMock.getRandomColor).toHaveBeenCalled();
  });

  /* -------------------------------------------------------------------------- */
  /*                              SELECTED ITEM ID                              */
  /* -------------------------------------------------------------------------- */

  describe('setSelectedItemId', () => {
    it('should set selected item id', () => {
      service.setSelectedItemId('selected-id');

      expect(service.selectedItemId()).toBe('selected-id');
    });

    it('should clear selected item id', () => {
      service.setSelectedItemId('selected-id');

      service.setSelectedItemId(undefined);

      expect(service.selectedItemId()).toBeUndefined();
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                PROJECT LEVEL                               */
  /* -------------------------------------------------------------------------- */

  describe('setProject', () => {
    it('should replace the current project', () => {
      const project = createProject();

      service.setProject(project);

      expect(service.project()).toEqual(project);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                  FILE LEVEL                                */
  /* -------------------------------------------------------------------------- */

  describe('addFile', () => {
    it('should add a file to the project', () => {
      const file = createFile('file-1');

      service.addFile(file);

      expect(service.project().files).toHaveLength(1);
      expect(service.project().files[0]).toEqual(file);
    });

    it('should return the file id', () => {
      const file = createFile('file-1');

      const result = service.addFile(file);

      expect(result).toBe('file-1');
    });
  });

  describe('removeFile', () => {
    it('should remove a file', () => {
      const file1 = createFile('file-1');
      const file2 = createFile('file-2');

      service.addFile(file1);
      service.addFile(file2);

      service.removeFile('file-1');

      expect(service.project().files).toHaveLength(1);
      expect(service.project().files[0].metadata.id).toBe('file-2');
    });

    it('should do nothing when file does not exist', () => {
      const file = createFile('file-1');

      service.addFile(file);

      service.removeFile('missing-id');

      expect(service.project().files).toHaveLength(1);
      expect(service.project().files[0]).toEqual(file);
    });

    it('should log when file does not exist', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      service.removeFile('missing-id');

      expect(consoleSpy).toHaveBeenCalledWith(service.ERROR.FileDoesNotExist);
    });
  });

  describe('updateFile', () => {
    it('should update an existing file', () => {
      const file = createFile('file-1', 'old-name');

      service.addFile(file);

      const updatedFile = createFile('file-1', 'updated-name');

      service.updateFile(updatedFile);

      expect(service.project().files[0].metadata.name).toBe(
        'updated-name'
      );
    });

    it('should do nothing if file does not exist', () => {
      const file = createFile('file-1');

      service.addFile(file);

      const updatedFile = createFile('missing-id');

      service.updateFile(updatedFile);

      expect(service.project().files).toHaveLength(1);
      expect(service.project().files[0].metadata.id).toBe('file-1');
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                 TRACK LEVEL                                */
  /* -------------------------------------------------------------------------- */

  describe('addTrack', () => {
    it('should add track to matching file', () => {
      const file = createFile('file-1');
      const track = createTrack('track-1');

      service.addFile(file);

      service.addTrack('file-1', track);

      expect(service.project().files[0].tracks).toHaveLength(1);
      expect(service.project().files[0].tracks[0]).toEqual(track);
    });

    it('should do nothing if file does not exist', () => {
      const track = createTrack('track-1');

      service.addTrack('missing-file', track);

      expect(service.project().files).toHaveLength(0);
    });
  });

  describe('removeTrack', () => {
    it('should remove track from file', () => {
      const file = createFile('file-1');

      const track1 = createTrack('track-1');
      const track2 = createTrack('track-2');

      file.tracks.push(track1, track2);

      service.addFile(file);

      service.removeTrack('track-1', 'file-1');

      expect(service.project().files[0].tracks).toHaveLength(1);
      expect(
        service.project().files[0].tracks[0].metadata.id
      ).toBe('track-2');
    });

    it('should do nothing if track does not exist', () => {
      const file = createFile('file-1');

      const track = createTrack('track-1');

      file.tracks.push(track);

      service.addFile(file);

      service.removeTrack('missing-track', 'file-1');

      expect(service.project().files[0].tracks).toHaveLength(1);
    });

    it('should do nothing if parent id is undefined', () => {
      const file = createFile('file-1');

      const track = createTrack('track-1');

      file.tracks.push(track);

      service.addFile(file);

      service.removeTrack('track-1', undefined as any);

      expect(service.project().files[0].tracks).toHaveLength(1);
    });
  });

  describe('updateTrack', () => {
    it('should update an existing track', () => {
      const file = createFile('file-1');

      const track = createTrack('track-1', 'old-track');

      file.tracks.push(track);

      service.addFile(file);

      const updatedTrack = createTrack(
        'track-1',
        'updated-track'
      );

      service.updateTrack(updatedTrack, 'file-1');

      expect(
        service.project().files[0].tracks[0].metadata.name
      ).toBe('updated-track');
    });

    it('should do nothing if track does not exist', () => {
      const file = createFile('file-1');

      const track = createTrack('track-1');

      file.tracks.push(track);

      service.addFile(file);

      const updatedTrack = createTrack('missing-track');

      service.updateTrack(updatedTrack, 'file-1');

      expect(service.project().files[0].tracks).toHaveLength(1);
      expect(
        service.project().files[0].tracks[0].metadata.id
      ).toBe('track-1');
    });

    it('should do nothing if parent id is undefined', () => {
      const file = createFile('file-1');

      const track = createTrack('track-1', 'original');

      file.tracks.push(track);

      service.addFile(file);

      const updatedTrack = createTrack(
        'track-1',
        'updated'
      );

      service.updateTrack(updatedTrack, undefined as any);

      expect(
        service.project().files[0].tracks[0].metadata.name
      ).toBe('original');
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                 ROUTE LEVEL                                */
  /* -------------------------------------------------------------------------- */

  describe('addRoute', () => {
    it('should add route to matching file', () => {
      const file = createFile('file-1');
      const route = createRoute('route-1');

      service.addFile(file);

      service.addRoute('file-1', route);

      expect(service.project().files[0].routes).toHaveLength(1);
      expect(service.project().files[0].routes[0]).toEqual(route);
    });

    it('should do nothing if file does not exist', () => {
      const route = createRoute('route-1');

      service.addRoute('missing-file', route);

      expect(service.project().files).toHaveLength(0);
    });
  });

  describe('removeRoute', () => {
    it('should remove route from file', () => {
      const file = createFile('file-1');

      const route1 = createRoute('route-1');
      const route2 = createRoute('route-2');

      file.routes.push(route1, route2);

      service.addFile(file);

      service.removeRoute('route-1', 'file-1');

      expect(service.project().files[0].routes).toHaveLength(1);
      expect(
        service.project().files[0].routes[0].metadata.id
      ).toBe('route-2');
    });

    it('should do nothing if route does not exist', () => {
      const file = createFile('file-1');

      const route = createRoute('route-1');

      file.routes.push(route);

      service.addFile(file);

      service.removeRoute('missing-route', 'file-1');

      expect(service.project().files[0].routes).toHaveLength(1);
    });

    it('should do nothing if parent id is undefined', () => {
      const file = createFile('file-1');

      const route = createRoute('route-1');

      file.routes.push(route);

      service.addFile(file);

      service.removeRoute('route-1', undefined as any);

      expect(service.project().files[0].routes).toHaveLength(1);
    });
  });

  describe('updateRoute', () => {
    it('should update an existing route', () => {
      const file = createFile('file-1');

      const route = createRoute('route-1', 'old-route');

      file.routes.push(route);

      service.addFile(file);

      const updatedRoute = createRoute(
        'route-1',
        'updated-route'
      );

      service.updateRoute(updatedRoute, 'file-1');

      expect(
        service.project().files[0].routes[0].metadata.name
      ).toBe('updated-route');
    });

    it('should do nothing if route does not exist', () => {
      const file = createFile('file-1');

      const route = createRoute('route-1');

      file.routes.push(route);

      service.addFile(file);

      const updatedRoute = createRoute('missing-route');

      service.updateRoute(updatedRoute, 'file-1');

      expect(service.project().files[0].routes).toHaveLength(1);
      expect(
        service.project().files[0].routes[0].metadata.id
      ).toBe('route-1');
    });

    it('should do nothing if parent id is undefined', () => {
      const file = createFile('file-1');

      const route = createRoute('route-1', 'original');

      file.routes.push(route);

      service.addFile(file);

      const updatedRoute = createRoute(
        'route-1',
        'updated'
      );

      service.updateRoute(updatedRoute, undefined as any);

      expect(
        service.project().files[0].routes[0].metadata.name
      ).toBe('original');
    });
  });


  /* -------------------------------------------------------------------------- */
  /*                               WAYPOINT LEVEL                               */
  /* -------------------------------------------------------------------------- */

  describe('addWaypoint', () => {
    it('should add waypoint to matching file', () => {
      const file = createFile('file-1');
      const waypoint = createWaypoint('waypoint-1');

      service.addFile(file);

      service.addWaypoint('file-1', waypoint);

      expect(service.project().files[0].waypoints).toHaveLength(1);
      expect(service.project().files[0].waypoints[0]).toEqual(waypoint);
    });

    it('should do nothing if file does not exist', () => {
      const waypoint = createWaypoint('waypoint-1');

      service.addWaypoint('missing-file', waypoint);

      expect(service.project().files).toHaveLength(0);
    });
  });

  describe('removeWaypoint', () => {
    it('should remove waypoint from file', () => {
      const file = createFile('file-1');

      const waypoint1 = createWaypoint('waypoint-1');
      const waypoint2 = createWaypoint('waypoint-2');

      file.waypoints.push(waypoint1, waypoint2);

      service.addFile(file);

      service.removeWaypoint('waypoint-1', 'file-1');

      expect(service.project().files[0].waypoints).toHaveLength(1);
      expect(
        service.project().files[0].waypoints[0].metadata.id
      ).toBe('waypoint-2');
    });

    it('should do nothing if waypoint does not exist', () => {
      const file = createFile('file-1');

      const waypoint = createWaypoint('waypoint-1');

      file.waypoints.push(waypoint);

      service.addFile(file);

      service.removeWaypoint('missing-waypoint', 'file-1');

      expect(service.project().files[0].waypoints).toHaveLength(1);
    });

    it('should do nothing if parent id is undefined', () => {
      const file = createFile('file-1');

      const waypoint = createWaypoint('waypoint-1');

      file.waypoints.push(waypoint);

      service.addFile(file);

      service.removeWaypoint('waypoint-1', undefined as any);

      expect(service.project().files[0].waypoints).toHaveLength(1);
    });
  });

  describe('updateWaypoint', () => {
    it('should update an existing waypoint', () => {
      const file = createFile('file-1');

      const waypoint = createWaypoint('waypoint-1', 'old-waypoint');

      file.waypoints.push(waypoint);

      service.addFile(file);

      const updatedWaypoint = createWaypoint(
        'waypoint-1',
        'updated-waypoint'
      );

      service.updateWaypoint(updatedWaypoint, 'file-1');

      expect(
        service.project().files[0].waypoints[0].metadata.name
      ).toBe('updated-waypoint');
    });

    it('should do nothing if waypoint does not exist', () => {
      const file = createFile('file-1');

      const waypoint = createWaypoint('waypoint-1');

      file.waypoints.push(waypoint);

      service.addFile(file);

      const updatedWaypoint = createWaypoint('missing-waypoint');

      service.updateWaypoint(updatedWaypoint, 'file-1');

      expect(service.project().files[0].waypoints).toHaveLength(1);
      expect(
        service.project().files[0].waypoints[0].metadata.id
      ).toBe('waypoint-1');
    });

    it('should do nothing if parent id is undefined', () => {
      const file = createFile('file-1');

      const waypoint = createWaypoint('waypoint-1', 'original');

      file.waypoints.push(waypoint);

      service.addFile(file);

      const updatedWaypoint = createWaypoint(
        'waypoint-1',
        'updated'
      );

      service.updateWaypoint(updatedWaypoint, undefined as any);

      expect(
        service.project().files[0].waypoints[0].metadata.name
      ).toBe('original');
    });
  });


});
