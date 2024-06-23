export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      chat_room: {
        Row: {
          created_at: string;
          id: string;
          last_message: string;
          last_message_date: string;
          users: string[] | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_message: string;
          last_message_date: string;
          users?: string[] | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_message?: string;
          last_message_date?: string;
          users?: string[] | null;
        };
        Relationships: [];
      };
      house: {
        Row: {
          bookmark: number;
          created_at: string;
          deposit_price: number;
          describe: string;
          district: string;
          house_appeal: string[];
          house_img: string[];
          house_size: number;
          house_type: number;
          id: string;
          manage_price: number;
          mates_num: number;
          monthly_price: number;
          post_title: string;
          region: string;
          rental_type: number;
          room_num: number;
          term: number[];
          updated_at: string;
          user_id: string;
          visible: number;
        };
        Insert: {
          bookmark: number;
          created_at?: string;
          deposit_price: number;
          describe: string;
          district: string;
          house_appeal: string[];
          house_img: string[];
          house_size: number;
          house_type: number;
          id?: string;
          manage_price: number;
          mates_num: number;
          monthly_price: number;
          post_title: string;
          region: string;
          rental_type: number;
          room_num: number;
          term: number[];
          updated_at?: string;
          user_id?: string;
          visible: number;
        };
        Update: {
          bookmark?: number;
          created_at?: string;
          deposit_price?: number;
          describe?: string;
          district?: string;
          house_appeal?: string[];
          house_img?: string[];
          house_size?: number;
          house_type?: number;
          id?: string;
          manage_price?: number;
          mates_num?: number;
          monthly_price?: number;
          post_title?: string;
          region?: string;
          rental_type?: number;
          room_num?: number;
          term?: number[];
          updated_at?: string;
          user_id?: string;
          visible?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'house_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      house_comment: {
        Row: {
          content: string;
          created_at: string;
          house_id: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          house_id: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          house_id?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'house_commet_house_id_fkey';
            columns: ['house_id'];
            isOneToOne: false;
            referencedRelation: 'house';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'house_commet_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      house_reply: {
        Row: {
          comment_id: string;
          content: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          comment_id: string;
          content: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'house_reply_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'house_comment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'house_reply_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          chat_room_id: string;
          created_at: string;
          from_user: string;
          id: string;
          message: string;
        };
        Insert: {
          chat_room_id?: string;
          created_at?: string;
          from_user?: string;
          id?: string;
          message: string;
        };
        Update: {
          chat_room_id?: string;
          created_at?: string;
          from_user?: string;
          id?: string;
          message?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_chat_room_id_fkey';
            columns: ['chat_room_id'];
            isOneToOne: false;
            referencedRelation: 'chat_room';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_from_user_fkey';
            columns: ['from_user'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user: {
        Row: {
          avatar_url: string | null;
          birth: number | null;
          created_at: string;
          email: string | null;
          gender: number;
          id: string;
          name: string;
          nickname: string | null;
          status: number;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          birth?: number | null;
          created_at?: string;
          email?: string | null;
          gender?: number;
          id: string;
          name: string;
          nickname?: string | null;
          status?: number;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          birth?: number | null;
          created_at?: string;
          email?: string | null;
          gender?: number;
          id?: string;
          name?: string;
          nickname?: string | null;
          status?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_activity: {
        Row: {
          category: number;
          content: string;
          content_id: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: number;
          content: string;
          content_id?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: number;
          content?: string;
          content_id?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_user_activity_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_alarm: {
        Row: {
          alarm_by_who: string;
          alarm_content: string;
          alarm_type: number;
          created_at: string;
          id: string;
          is_checked: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          alarm_by_who: string;
          alarm_content: string;
          alarm_type: number;
          created_at?: string;
          id?: string;
          is_checked: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          alarm_by_who?: string;
          alarm_content?: string;
          alarm_type?: number;
          created_at?: string;
          id?: string;
          is_checked?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_alarm_users_id_fk';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_alarm_setting: {
        Row: {
          chat_alarm_1: boolean;
          created_at: string;
          house_alarm_1: boolean;
          house_alarm_2: boolean;
          house_alarm_3: boolean;
          id: string;
          lounge_alarm_1: boolean;
          lounge_alarm_2: boolean;
          updated_at: string;
        };
        Insert: {
          chat_alarm_1: boolean;
          created_at?: string;
          house_alarm_1: boolean;
          house_alarm_2: boolean;
          house_alarm_3: boolean;
          id: string;
          lounge_alarm_1: boolean;
          lounge_alarm_2: boolean;
          updated_at?: string;
        };
        Update: {
          chat_alarm_1?: boolean;
          created_at?: string;
          house_alarm_1?: boolean;
          house_alarm_2?: boolean;
          house_alarm_3?: boolean;
          id?: string;
          lounge_alarm_1?: boolean;
          lounge_alarm_2?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_alarm_setting_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_block: {
        Row: {
          block_id: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          block_id: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          block_id?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_block_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_chat: {
        Row: {
          chat_id: string;
          id: string;
          last_read: string;
        };
        Insert: {
          chat_id: string;
          id?: string;
          last_read?: string;
        };
        Update: {
          chat_id?: string;
          id?: string;
          last_read?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_chat_chat_id_fkey';
            columns: ['chat_id'];
            isOneToOne: false;
            referencedRelation: 'chat_room';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_chat_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_friend: {
        Row: {
          created_at: string;
          friend_id: string | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          friend_id?: string | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          friend_id?: string | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_friend_friend_id_fkey';
            columns: ['friend_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_friend_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_house_status: {
        Row: {
          created_at: string;
          house_id: string;
          house_status: number;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          house_id?: string;
          house_status?: number;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          house_id?: string;
          house_status?: number;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_house_status_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_lifestyle: {
        Row: {
          appeals: string[] | null;
          created_at: string;
          id: string;
          pet: number;
          smoking: boolean;
          updated_at: string | null;
        };
        Insert: {
          appeals?: string[] | null;
          created_at?: string;
          id: string;
          pet: number;
          smoking: boolean;
          updated_at?: string | null;
        };
        Update: {
          appeals?: string[] | null;
          created_at?: string;
          id?: string;
          pet?: number;
          smoking?: boolean;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_lifestyle_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_looking_house: {
        Row: {
          created_at: string;
          deposit_price: number[];
          id: string;
          monthly_rental_price: number[];
          regions: string[] | null;
          rental_type: number;
          term: number[];
          type: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deposit_price: number[];
          id: string;
          monthly_rental_price: number[];
          regions?: string[] | null;
          rental_type: number;
          term: number[];
          type: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deposit_price?: number[];
          id?: string;
          monthly_rental_price?: number[];
          regions?: string[] | null;
          rental_type?: number;
          term?: number[];
          type?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_looking_house_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_mate_style: {
        Row: {
          created_at: string;
          gender: number;
          id: string;
          mate_appeals: string[] | null;
          mates_number: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          gender: number;
          id: string;
          mate_appeals?: string[] | null;
          mates_number: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          gender?: number;
          id?: string;
          mate_appeals?: string[] | null;
          mates_number?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_mate_style_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_send_friend: {
        Row: {
          created_at: string;
          from_id: string;
          id: string;
          to_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          from_id: string;
          id?: string;
          to_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          from_id?: string;
          id?: string;
          to_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_send_friend_from_id_fkey';
            columns: ['from_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_send_friend_to_id_fkey';
            columns: ['to_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_theme: {
        Row: {
          created_at: string;
          font_size: number;
          id: string;
          languague: number;
          theme: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          font_size: number;
          id: string;
          languague: number;
          theme: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          font_size?: number;
          id?: string;
          languague?: number;
          theme?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_theme_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
